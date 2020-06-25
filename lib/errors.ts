const patterns : Array<[RegExp, (info: any) => string]> = [
    [/token is empty/, _ => "登陆已经过期"],
    [/incorrect Username or Password/i, _ => "用户名或者密码错误"],
    [/username already exists/i, _ => "用户名已经存在"],
    [/failed to fetch/i, _ => "请求失败, 网络似乎有问题"],
    [/password is wrong/i, _ => "密码似乎错误辣!"],
    [/Email has been used/i, _ => "邮箱已经被用辣！"],
    [/Phone has been used/i, _ => "电话已经被用辣！"]
]

function messageByObj(origin: Partial<{message: string, noTranslate?: boolean}>) : string {
    if (origin.message == undefined || origin.message == null) {
        return `无法解析的异常:"${origin}"...`
    }
    if (origin.noTranslate) {
        return origin.message
    }
    return messageBy(origin.message)
}

function messageBy(origin: string) : string {
    for (const [pattern, message] of patterns) {
        if (pattern.test(origin)) {
            return message(origin)
        }
    }
    return `未知错误: ${origin}`
}

export default { messageBy, messageByObj }