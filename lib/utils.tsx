import { useState } from "react"
import { ITextFieldProps, TextField, DefaultPalette } from "@fluentui/react"
import { Danmaku } from "./modles"
import { DateTime } from "luxon"

async function startWork<T>(work: () => Promise<T> | T, begin: () => () => void): Promise<T> {
    const end = begin()
    const result = work()
    if (result instanceof Promise) {
        return await result.finally(end)
    }
    return await result
}

function useWork(): [boolean, () => () => void] {
    const [working, setWorking] = useState(false)
    const manager = () => {
        setWorking(true)
        return () => setWorking(false)
    }
    return [working, manager]
}

// init --------------------------~~~~~~~~~~~~~~~~>
//                               ^
//              textInput ~~~~~~~+
// A little like `switch`, a little bit hacky.
function useBoundInput(props: ITextFieldProps, init?: string): [JSX.Element, string] {
    const [value, setValue] = useState('')
    const [modified, setModified] = useState(false)
    if (!modified && init != null && init != undefined && init != value) {
        // we keep sync with init until modified, 
        // so that we can receive an 'asynchronous' initial value.
        setValue(init)
    }
    const onChange = (e, v) => {
        if (props.onChange) props.onChange(e, v);
        setModified(true);
        setValue(v);
    }
    return [<TextField {...props} onChange={onChange} value={modified ? value : init} />, value]
}

function makeLoginKey(username: string): Partial<{ username, phone, email }> {
    if (username.startsWith('+')) return { phone: username }
    if (/^[0-9]/.test(username)) return { phone: `+86${username}` }
    if (username.indexOf('@') != -1) return { email: username }
    return { username }
}

const usernameChecker = (username: string) => /[a-zA-Z][\d\w_-]{0,19}/.test(username) ? '' : '名字的长度不能超过 20 个字符, 而且必须以字母开头, 还不能包含特殊符号哦！'
const emailChecker = (email: string) => email.length == 0 || /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email) ? '' : '邮箱格式不对哦!'
const phoneChecker = (phone: string) => (phone.length == 0 || phone.length == 11 || (phone.startsWith('+86') && phone.length == 14)) ? '' : '手机号必须是中国地区的手机号(+86)哦!'
const makeDanmaku = (content: string, by: string): Danmaku => {
    return {
        user: { username: by },
        time: DateTime.local().toString(), content, 
        size: '28px', 
        color: DefaultPalette.themePrimary
    }
}

type WithValueType<T, V> = { [P in keyof T]: V }

export type { WithValueType };
export default { startWork, useWork, makeLoginKey, useBoundInput, usernameChecker, emailChecker, phoneChecker, makeDanmaku }