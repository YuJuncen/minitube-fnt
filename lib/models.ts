type User = {
    id: string,
    created_at: string,
    updated_at: string,
    username: string,
    email?: string,
    phone?: string,
    live_name?: string,
    live_intro?: string,
}

type DiffUserInfo = Partial<{
    phone: string,
    email: string,
    live_intro: string,
    live_name: string
}>

type Danmaku = {
    size: string,
    color: string,
    content: string,
    time: string,
    user: {
        username: string,
        avatar?: string,
    }
}

type Profile = {
    username: string,
    live_name: string,
    live_intro: string,
}

type LiveProfile = {
    username: string,
    live_name: string,
    live_intro: string,
    start_time: string,
    living: boolean
}

const defaultUser: User = {
    id: "????",
    username: "[未登录]",
    created_at: "",
    updated_at: ""
}

export default { defaultUser }
export type { User, DiffUserInfo, Danmaku, Profile, LiveProfile }