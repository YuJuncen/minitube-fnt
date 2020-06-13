import sha256 from 'crypto-js/sha256'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import codes from './codes'
type LoginResult = { code: 200, expire: string, token: string } | { code: number, message: string }
const TOKEN_NOT_EXPIRED = 'token-not-expired'
const TOKEN = 'token'
class Client {
    apiURL: string
    get streamAPIURL(): string {
        return `${this.apiURL}/stream`
    }

    get headers(): any {
        const headers = {}
        headers['Content-Type'] = 'application/json'
        if (this.token.length) {
            headers['Authorization'] = `MiniTube ${this.token}`
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
        return cookies.token || ''
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

    async logout() {
        const result = await fetch(`${this.apiURL}/logout`, {
            method: 'POST',
            headers: {
                ...this.headers
            }
        })
        const j = await result.json()
        if (j.code == 200) {
            destroyCookie(null, TOKEN_NOT_EXPIRED)
            destroyCookie(null, TOKEN)
        }
        return j
    }

    async refresh(): Promise<boolean> {
        const cookies = parseCookies()
        if (!cookies[TOKEN_NOT_EXPIRED] && cookies.token) {
            const result = await fetch(`${this.apiURL}/refresh`, {
                method: "POST",
                headers: {
                    ...this.headers
                }
            })
            const j = await result.json()
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

    async register(username: string, password: string): Promise<{ code: number, message: string }> {
        const result = await fetch(`${this.apiURL}/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password: this.encryptPassword(password)
            }),
        })
        const j = await result.json()
        return j
    }

    async login(username: string, password: string): Promise<LoginResult> {
        const result = await fetch(`${this.apiURL}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password: this.encryptPassword(password)
            })
        })
        const j = await result.json()
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
        const result = await fetch(`${this.streamAPIURL}/key/${username}`, {
            headers: {
                ...this.headers
            }
        })
        const j = await result.json()
        return j
    }
}

export default Client