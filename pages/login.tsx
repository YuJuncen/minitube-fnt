import Client from '../lib/miniclient'
import Codes from '../lib/codes'
import { setCookie } from 'nookies'
import { Text } from '@fluentui/react/lib-commonjs/Text'
import { Stack, IStackTokens, IStackItemStyles } from '@fluentui/react/lib-commonjs/Stack'
import { TextField } from '@fluentui/react/lib-commonjs/TextField'
import { PrimaryButton } from '@fluentui/react/lib-commonjs/Button'
import { MessageBar, MessageBarType } from '@fluentui/react/lib-commonjs/MessageBar'
import { useState, useContext, useEffect } from 'react';
import errors from '../lib/errors'
import Title from '../components/title'
import { useRouter } from 'next/router'
import { Button, Link } from '@fluentui/react'
import utils from '../lib/utils'
import MinitubeContext from '../lib/global'
import models from '../lib/models'


export default function Login() {
    const [username, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState({ message: '', code: Codes.OK })
    const [working, setWorking] = utils.useWork()

    const router = useRouter()
    const usernameChecker = () => (username.length < 21) ? '' : '名字的长度不能超过 20 个字符哦！'
    const valid = () => usernameChecker() == '' && password != '' && username != ''
    const {client, user, setUser} = useContext(MinitubeContext)
    if (user !== models.defaultUser) {
        router.replace('/mine')
    }
    const registerFormStyle: IStackItemStyles = {
        root: {
            width: 500,
        }
    }
    const registerTokens: IStackTokens = {
        maxWidth: 500,
        childrenGap: 10,
    }
    const toRegister = () => {
        router.push('/register')
    }
    const login = async () => {
        const result = await client.login(username, password)
        if (!Client.isOK(result)) {
            const errResult = result as { message: string, code: number }
            setError({ message: errResult.message, code: errResult.code })
            return
        }
        const user = await client.whoAmI()
        if (Client.isOK(user)) {
            setUser(user.user)
            router.push("/")
            return
        }
        setError(user)
    }

    return (
        <Stack style={{height: '80vh'}} verticalAlign="center" horizontalAlign="center">
            <Stack.Item align='center' styles={registerFormStyle}>
                <Stack tokens={registerTokens}>
                    {error.message.length && (
                        <MessageBar messageBarType={MessageBarType.blocked} onDismiss={() => setError({ message: "", code: Codes.OK })}>
                            {error.code}: <em>{errors.messageBy(error.message)}</em>
                        </MessageBar>
                    )}
                    <TextField label="用户名" placeholder="手机号/邮箱/用户名都可以哦!" 
                        onGetErrorMessage={usernameChecker} 
                        required={true} 
                        onChange={(_, v) => { setUserName(v) }} />
                    <TextField type="password" label="密码" required={true} onChange={(_, v) => { setPassword(v) }} />
                    <PrimaryButton text={ working ? "登录中" : "登录"} disabled={!valid() || working} onClick={() => utils.startWork(login, setWorking)} />
                    <Button text="还不是 yantube 的粉丝? 去注册!" onClick={toRegister}></Button>

                </Stack>
            </Stack.Item>
        </Stack>
    );
}
