import { Stack, IStackProps, Text, Separator, Persona, IStackStyles, DefaultPalette, Button, DefaultButton, PrimaryButton, Link, IconButton, IconNames } from "@fluentui/react";
import { ITextProps } from "@fluentui/react/lib-commonjs/Text";
import UserPersona from "./user-persona";
import MinitubeContext from "../lib/global";
import { useContext, useCallback, useMemo, CSSProperties } from "react";
import styles from "../lib/styles";
import { useRouter } from "next/router";
import models from "../lib/models";

const pageMapping: [RegExp, string][] = [
    [/\/mine$/, "我的"],
    [/\/live\/.*$/, "直播"],
    [/\/$/, "首页"],
    [/\/login$/, "登录"],
    [/\/register$/, "注册"]
]

const matchPage = (url) => {
    for (const [re, title] of pageMapping) {
        if (re.test(url)) {
            return title
        }
    }
    console.warn(`accessing unknown url ${url}`)
    return "未见之地"
}

export default function HeadTitle() {
    const ctx = useContext(MinitubeContext)
    const router = useRouter()
    const toLogin = useCallback(() => router.push('/login'), [router])
    const toRegister = useCallback(() => router.push('/register'), [router])
    const toMine = useCallback(() => router.push('/mine'), [router])
    const toIndex = useCallback(() => router.push('/'), [router])
    const pathname = useMemo(() => matchPage(router.pathname), [router])
    const titleStyle: CSSProperties = {
        position: 'sticky',
        top: 0,
        zIndex: 1001,
        backgroundColor: DefaultPalette.white,
        border: 'solid',
        borderWidth: '0 0 1px 0',
        borderColor: DefaultPalette.neutralLight,
        marginBottom: '11px'
    }
    const loginOrRegister = [
        <DefaultButton key="login-button" onClick={toLogin} style={{ marginRight: 8 }}>登录</DefaultButton>,
        <PrimaryButton key="register" onClick={toRegister}>注册</PrimaryButton>]
    return (
        <Stack horizontal verticalAlign='baseline'
            tokens={{ childrenGap: 8, padding: "s1 10%" }}
            style={titleStyle}>
            {pathname !== "首页" ?
                <IconButton iconProps={{ iconName: 'Back' }} onClick={toIndex} styles={{ icon: { color: DefaultPalette.neutralDark } }} /> :
                <Text variant="mediumPlus">
                    Minitube
            </Text>}
            <Separator vertical></Separator>
            <Text variant='xxLargePlus'>{pathname}</Text>
            <Stack.Item grow key="space">
                <div style={styles.growToHMax}></div>
            </Stack.Item>
            <Stack.Item key="user-info" align="center">
                {ctx.user !== models.defaultUser ?
                    <UserPersona onClick={toMine} user={ctx.user} styles={{
                        root:
                        {   
                            transition: 'all .3s',
                            selectors:
                            {
                                '&:hover':
                                {
                                    'cursor': 'pointer',
                                    backgroundColor: DefaultPalette.neutralLight, 
                                }
                            }
                        }
                    }}></UserPersona> :
                    loginOrRegister}
            </Stack.Item>
        </Stack>
    )
}