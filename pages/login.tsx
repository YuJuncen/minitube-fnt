import Client from '../lib/miniclient'
import Codes from '../lib/codes'
import { setCookie } from 'nookies'
import { Text } from '@fluentui/react/lib-commonjs/Text'
import { Stack, IStackTokens, IStackItemStyles } from '@fluentui/react/lib-commonjs/Stack'
import { TextField } from '@fluentui/react/lib-commonjs/TextField'
import { PrimaryButton } from '@fluentui/react/lib-commonjs/Button'
import { MessageBar, MessageBarType } from '@fluentui/react/lib-commonjs/MessageBar'
import { useState } from 'react';
import Router from 'next/router'


export default function Login() {
    const [username, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState({ message: '', code: Codes.OK })

    const usernameChecker = () => (username.length > 0 && username.length < 21) ? '' : '名字的长度必须要在 1~20 个字符之间哦！'
    const valid = () => usernameChecker() == '' && password != ''
    const client = Client.global()
    const registerFormStyle: IStackItemStyles = {
        root: {
            width: 450,
        }
    }
    const registerTokens: IStackTokens = {
        maxWidth: 450,
        childrenGap: 10,
        padding: 's1 s2'
    }
    const register = async () => {
        const result = await client.login(username, password)
        if (result.code != Codes.OK) {
            const errResult = result as { message: string, code: number }
            setError({ message: errResult.message, code: errResult.code })
            return
        }
        const okResult = result as { code: 200, token: string, expire: string }
        Router.push("/")
    }

    return (
        <Stack>
            <Stack.Item align='center' styles={registerFormStyle}>
                <Stack tokens={registerTokens}>
                    <Stack horizontal verticalAlign='baseline'><Text variant='xxLargePlus'>登录</Text> <Text variant="mediumPlus">minitube</Text></Stack>
                    <TextField label="用户名" onGetErrorMessage={usernameChecker} required={true} onChange={(_, v) => { setUserName(v) }} />
                    <TextField type="password" label="密码" required={true} onChange={(_, v) => { setPassword(v) }} />
                    <PrimaryButton text="登录" disabled={!valid()} onClick={register} />
                    {error.message.length && (
                        <MessageBar messageBarType={MessageBarType.blocked} onDismiss={() => setError({ message: "", code: Codes.OK })}>
                            Oops...{error.code}: <em>{error.message}</em>
                        </MessageBar>
                    )}
                </Stack>
            </Stack.Item>
        </Stack>
    );
}
