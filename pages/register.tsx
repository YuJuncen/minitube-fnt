import Client from '../lib/miniclient'
import Codes from '../lib/codes'
import { Text } from '@fluentui/react/lib-commonjs/Text'
import { Stack, IStackTokens, IStackItemStyles } from '@fluentui/react/lib-commonjs/Stack'
import { TextField } from '@fluentui/react/lib-commonjs/TextField'
import { PrimaryButton } from '@fluentui/react/lib-commonjs/Button'
import { MessageBar, MessageBarType } from '@fluentui/react/lib-commonjs/MessageBar'
import { useState } from 'react';
import Router from 'next/router'
import errors from '../lib/errors'
import Title from '../components/title'
import { Button } from '@fluentui/react'
import utils from '../lib/utils'


export default function Register() {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [repeat, setRepeat] = useState<string>('')
  const [error, setError] = useState({ message: '', code: Codes.OK })
  const [working, setWorking] = useState(false)

  const checkRepeat = () => password == repeat ? '' : '密码还有确认密码不一致哦！'
  const usernameChecker = () => (username.length < 21) ? '' : '名字的长度不能超过 20 个字符哦！'
  const valid = () => [username, password, repeat].every(x => x != '') && usernameChecker() == '' && checkRepeat() == ''
  const client = Client.global()
  const registerFormStyle: IStackItemStyles = {
    root: {
      width: 500,
    }
  }
  const registerTokens: IStackTokens = {
    childrenGap: 10,
  }
  const register = async () => {
    const result = await client.register(username, password)
    if (result.code != Codes.OK) {
      setError({ message: result.message, code: result.code })
      return
    }
    Router.push("/")
  }
  const startRegister = () => utils.startWork(register, () => {
    setWorking(true)
    return () => setWorking(false)
  })

  return (
    <Stack>
      <Stack.Item align='center' styles={registerFormStyle}>
        <Stack tokens={registerTokens}>
          <Title text="注册"></Title>
          {error.message.length && (
            <MessageBar messageBarType={MessageBarType.blocked} onDismiss={() => setError({ message: "", code: Codes.OK })}>
              {error.code}: <em>{errors.messageBy(error.message)}</em>
            </MessageBar>
          )}
          <TextField label="用户名" onGetErrorMessage={usernameChecker} required={true} onChange={(_, v) => { setUserName(v) }} />
          <TextField type="password" label="密码" required={true} onChange={(_, v) => { setPassword(v) }} />
          <TextField type="password" label="确认密码" required={true} onGetErrorMessage={checkRepeat} onChange={(_, v) => { setRepeat(v) }} />
          
          <PrimaryButton text={working ? '正在注册...' : '注册'} disabled={!valid() || working} onClick={startRegister} />
          <Button text="已经是 yantube 的粉丝? 去登陆!" onClick={() => Router.push('/login')} />
        </Stack>
      </Stack.Item>
    </Stack>
  );
}
