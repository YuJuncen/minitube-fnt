import Client from '../lib/miniclient'
import Codes from '../lib/codes'
import { Text } from '@fluentui/react/lib-commonjs/Text'
import { Stack, IStackTokens, IStackItemStyles } from '@fluentui/react/lib-commonjs/Stack'
import { TextField } from '@fluentui/react/lib-commonjs/TextField'
import { PrimaryButton } from '@fluentui/react/lib-commonjs/Button'
import { MessageBar, MessageBarType } from '@fluentui/react/lib-commonjs/MessageBar'
import { useState } from 'react';
import Router from 'next/router'


export default function Register() {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [repeat, setRepeat] = useState<string>('')
  const [error, setError] = useState({message: '', code: Codes.OK})

  const checkRepeat = () => password == repeat ? '' : '密码还有确认密码不一致哦！'
  const usernameChecker = () => (username.length > 0 && username.length < 21) ? '' : '名字的长度必须要在 1~20 个字符之间哦！'
  const valid = () => usernameChecker() == '' && checkRepeat() == ''
  const client = Client.global()
  const registerFormStyle : IStackItemStyles = {
    root: {
      width: 450,
    }
  }
  const registerTokens : IStackTokens = {
    childrenGap: 10,
    padding: '20px'
  }
  const register = async () => {
    const result = await client.register(username, password)
    if (result.code != Codes.OK) {
      setError({message: result.message, code: result.code})
      return
    }
    Router.push("/")
  }

  return (
    <Stack>
      <Stack.Item align='center' styles={registerFormStyle}>
        <Stack tokens={registerTokens}>
          <Stack horizontal verticalAlign='baseline'><Text variant='xxLargePlus'>注册</Text> <Text variant="mediumPlus">minitube</Text></Stack>
          <TextField label="用户名" onGetErrorMessage={usernameChecker} required={true} onChange={(_, v) => { setUserName(v) }} />
          <TextField type="password" label="密码" required={true} onChange={(_, v) => { setPassword(v) }} />
          <TextField type="password" label="确认密码" required={true} onGetErrorMessage={checkRepeat} onChange={(_, v) => { setRepeat(v) }}/>
          <PrimaryButton text="注册" disabled={!valid()} onClick={register}/>
          { error.message.length && (
            <MessageBar messageBarType={MessageBarType.blocked} onDismiss={() => setError({message:"", code:Codes.OK})}>  
              Oops...{error.code}: <em>{error.message}</em>
            </MessageBar>
          ) }
        </Stack>
      </Stack.Item>
    </Stack>
  );
}
