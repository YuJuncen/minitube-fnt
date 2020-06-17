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

export type { User, DiffUserInfo }