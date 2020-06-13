function messageBy(origin: string) : string {
    if (/token is empty/.test(origin)) {
        return "登陆已经过期"
    }
    return `unexplainable error: ${origin}`
}

export default { messageBy }