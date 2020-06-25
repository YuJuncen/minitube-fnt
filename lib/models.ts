import { EventEmitter } from "events"

type User = {
    id: number,
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
    living: boolean,
    follow: FollowState,
    watching: number,
}

type History = {
    username: string,
    timestamp: number
}

const defaultUser: User = {
    id: -1,
    username: "[未登录]",
    created_at: "",
    updated_at: ""
}

enum FollowState {
    NO_RELATION = 0,
    I_FOLLOWED = 1,
    FOLLOWING_ME = 2,
    FOLLOW_EACH_OTHER = 3,
    UNKNOWN = -1
}

type LiveStream = {
    close: () => void,
    danmakus: EventEmitter,
    source: string,
}

const isFollowed = (state: FollowState) : boolean => state == FollowState.FOLLOW_EACH_OTHER || state == FollowState.I_FOLLOWED
const notFollowed = (state: FollowState) : boolean => !isFollowed(state)

export default { defaultUser, FollowState, isFollowed, notFollowed }
export type { User, DiffUserInfo, Danmaku, Profile, LiveProfile, History, FollowState, LiveStream }