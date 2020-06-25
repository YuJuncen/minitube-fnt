import sha256 from 'crypto-js/sha256'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import codes from './codes'
import utils from './utils'
import { User, DiffUserInfo, Profile, LiveProfile, History, LiveStream, Danmaku } from './models'
import { LoadedEnvFiles } from 'next/dist/lib/load-env-config'
import { EventEmitter } from 'events'
type LoginResult = { code: 200, expire: string, token: string } | { code: number, message: string }
type Success<T> = { code: 200 } & T
type Fail = { code: number, message: string }
type Reply<T> = Success<T> | Fail
const TOKEN_NOT_EXPIRED = 'token-not-expired'
const TOKEN = 'token'
class Client {
    static isOK<T>(r: Reply<T>): r is Success<T> {
        return r.code == 200
    }
    static isFail<T>(r: Reply<T>): r is Fail {
        return r.code != 200
    }

    apiURL: string
    get streamAPIURL(): string {
        return `${this.apiURL}/stream`
    }

    pullStreamAPIFor(username: string): string {
        return `${this.apiURL}:8080/live/${username}.flv`
    }

    async connectToStream(username: string) : Promise<LiveStream> {
        const events = new EventEmitter()
        events.on("danmaku", (d: Danmaku) => {
            console.log("sending danmaku to server:", d)
        })
        return {
            close() {
                events.removeAllListeners()
            },
            danmakus: events,
            source: this.pullStreamAPIFor(username)
        }
    }

    async getHeaders(): Promise<any> {
        const headers = {}
        headers['Content-Type'] = 'application/json'
        console.log(this.token)
        if (this.token.length) {
            headers['Authorization'] = `MiniTube ${await this.getOrRefreshToken()}`
        }
        return headers
    }

    get token(): string {
        const cookies = parseCookies()
        return cookies.token || ''
    }

    async getOrRefreshToken(): Promise<string> {
        const cookies = parseCookies()
        if (!cookies[TOKEN_NOT_EXPIRED]) {
            console.log("token refreshing")
            if (await this.refresh()) {
                console.log("token refreshed")
            }
        }
        return parseCookies().token || ''
    }

    constructor(apiURL: string) {
        this.apiURL = apiURL
    }

    encryptPassword(password: string): string {
        return sha256(password).words
            .map(x => Math.abs(x).toString(16).padStart(8, '0'))
            .join("")
    }

    static global(): Client {
        return new Client(process.env.API || "http://47.103.193.47")
    }

    private async fetchJSON(url: RequestInfo, init: RequestInit) {
        try {
            const result = await fetch(url, init)
            const j = await result.json()
            return j
        } catch (e) {
            if (e instanceof TypeError) {
                return {
                    code: 601,
                    error: e,
                    noTranslate: true,
                    message: '网络似乎有点问题'
                }
            }
            console.log(e)
            return {
                // 600 不是 HTTP Status Code,所以 ytb 应该不会用它.
                code: 600,
                error: e,
                message: '发生了未知的错误,请前往控制台查看详细信息'
            }
        }
    }

    async logout() {
        const j = await this.fetchJSON(`${this.apiURL}/logout`, {
            method: 'POST',
            headers: {
                ...await this.getHeaders()
            }
        })
        if (j.code == 200) {
            destroyCookie(null, TOKEN_NOT_EXPIRED)
            destroyCookie(null, TOKEN)
        }
        return j
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<Reply<void>> {
        const result = await this.fetchJSON(`${this.apiURL}/user/password`, {
            method: "POST",
            headers: await this.getHeaders(),
            body: JSON.stringify({
                old_password: this.encryptPassword(oldPassword),
                new_password: this.encryptPassword(newPassword)
            })
        })
        return result
    }

    async refresh(): Promise<boolean> {
        const cookies = parseCookies()
        if (!cookies[TOKEN_NOT_EXPIRED] && cookies.token) {
            const j = await this.fetchJSON(`${this.apiURL}/refresh`, {
                method: "POST",
                headers: {
                    'Authorization': `MiniTube ${this.token}`
                }
            })
            if (j.code == codes.OK) {
                setCookie(null, TOKEN, j.token, {
                    maxAge: 24 * 60 * 60
                })
                setCookie(null, TOKEN_NOT_EXPIRED, 'true', {
                    maxAge: 60 * 60
                })
                return true
            }
        }
        return false
    }

    async register(username: string, password: string, init?: { email?: string, phone?: string }): Promise<{ code: number, message: string }> {
        const j = await this.fetchJSON(`${this.apiURL}/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password: this.encryptPassword(password),
                ...init
            }),
        })
        await this.login(username, this.encryptPassword(password))
        return j
    }

    async whoAmI(): Promise<Reply<{ user: User }>> {
        const j = await this.fetchJSON(`${this.apiURL}/user/me`, {
            headers: {
                ...await this.getHeaders()
            }
        })
        return j
    }

    async login(username: string, password: string): Promise<LoginResult> {
        const j = await this.fetchJSON(`${this.apiURL}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...utils.makeLoginKey(username),
                password: this.encryptPassword(password)
            })
        })
        if (j.code == codes.OK) {
            setCookie(null, TOKEN, j.token, {
                maxAge: 24 * 60 * 60
            })
            setCookie(null, TOKEN_NOT_EXPIRED, 'true', {
                maxAge: 60 * 60
            })
        }
        return j
    }

    async streamCode(username: string) {
        const j = await this.fetchJSON(`${this.streamAPIURL}/key/${username}`, {
            headers: {
                ...await this.getHeaders()
            }
        })
        return j
    }

    async currentUserStreamCode(): Promise<Reply<{ key: string }>> {
        const me = await this.whoAmI()
        if (Client.isOK(me)) {
            return this.streamCode(me.user.username)
        }
        return me
    }

    async updateProfile(diffProfile: DiffUserInfo): Promise<Reply<{}>> {
        const result = await this.fetchJSON(`${this.apiURL}/user/profile`, {
            method: 'POST',
            body: JSON.stringify(diffProfile),
            headers: await this.getHeaders()
        })
        return result
    }

    async getProfileOf(user: string) : Promise<Reply<{user: LiveProfile}>> {
        const result = await this.fetchJSON(`${this.apiURL}/profile/${user}`, {
            headers: await this.getHeaders()
        })
        return result
    }

    async getRandomLiveRooms(count: number) : Promise<Reply<{users: LiveProfile[]}>> {
        return await this.fetchJSON(`${this.apiURL}/living/${count}`, {})
    }
 
    async getHistory() : Promise<Reply<{history: History[]}>> {
        return await this.fetchJSON(`${this.apiURL}/user/history`, {
            headers: await this.getHeaders()
        })
    }

    async followTo(username: string) : Promise<Reply<{}>> {
        return await this.fetchJSON(`${this.apiURL}/user/follow/${username}`, {
            method: "POST",
            headers: await this.getHeaders()
        })
    }

    async followerOf(username: string) : Promise<Reply<{followers: LiveProfile[]}>> {
        return await this.fetchJSON(`${this.apiURL}/followers/${username}`, {
            headers: await this.getHeaders()
        })
    }

    async followingOf(username: string) : Promise<Reply<{followings: LiveProfile[]}>> {
        return await this.fetchJSON(`${this.apiURL}/followings/${username}`, {
            headers: await this.getHeaders()
        })
    }

    async unfollow(username: string) : Promise<Reply<{}>> {
        return await this.fetchJSON(`${this.apiURL}/user/unfollow/${username}`, {
            method: "POST",
            headers: await this.getHeaders()
        })
    }
}

export default Client
export type { Fail, Success }