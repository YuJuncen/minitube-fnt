const patterns : Array<[RegExp, (info: any) => string]> = [
    [/token is empty/, _ => "登陆已经过期"],
    [/incorrect Username or Password/i, _ => "用户名或者密码错误"],
    [/username already exists/i, _ => "用户名已经存在"]
]

function messageBy(origin: string) : string {
    for (const [pattern, message] of patterns) {
        if (pattern.test(origin)) {
            return message(origin)
        }
    }
    return `未知错误: ${origin}`
}

export default { messageBy }