import { useState, useEffect, useRef, useContext } from "react";
import { Stack, MessageBar, MessageBarType, IStackProps, Shimmer, TextField, Toggle, Button, ButtonType, IconButton, IconNames, PrimaryButton, DefaultPalette } from "@fluentui/react"
import Client from "../lib/miniclient";
import { IStackTokens } from "@fluentui/react/lib-commonjs/Stack";
import ErrorNotification from "./error-notification";
import MinitubeContext from "../lib/global";
import styles from "../lib/styles";

const OK = 200

export default function StreamCode({...props}: IStackProps) {
    const [code, setCode] = useState('')
    const [error, setError] = useState(null)
    const [hidden, setHidden] = useState(true)
    const {client, user} = useContext(MinitubeContext)
    const [message, setMessage] = useState({
        type: MessageBarType.success,
        message: "已经获得推流码！"
    })
    useEffect(() => {
        (async () => {
            const codeResponse = await client.currentUserStreamCode()
            if (Client.isFail(codeResponse)) {
                setError(codeResponse)
                return
            }
            setCode(codeResponse.key)
        })()
    }, [])
    const cardTokens : IStackTokens = {
        childrenGap: 12
    }

    return (
        <Stack tokens={cardTokens} {...props}>
            {!(code || error) && 
                <Shimmer></Shimmer>
            }
            {code.length && [
            <MessageBar
                messageBarType={message.type}
                truncated={true}
            >
                <b>{message.message}</b>
            </MessageBar>,
            <TextField label="我的直播间地址" value={`${client.apiURL}/live/${user.username}`} readOnly></TextField>,
            <Stack verticalAlign="space-between" tokens={{childrenGap: 12}}>
                <Stack.Item grow={1}>
                    <Stack horizontal verticalAlign="end">
                        <Stack.Item key="code" grow>
                            <TextField type={hidden ? 'password' : 'text'} value={code} label="推流码" readOnly></TextField>
                        </Stack.Item>
                        <IconButton 
                            iconProps={{iconName: !hidden ? 'Hide' : 'RedEye'}}
                            styles={{icon: {color: DefaultPalette.black}}}
                            onClick={() => setHidden(h => !h)}></IconButton>
                    </Stack>
                </Stack.Item>
                <Stack.Item key="copy">
                    <PrimaryButton style={styles.growToHMax} onClick={() => {
                        navigator.clipboard.writeText(code)
                        .then(() => setMessage({message: "复制成功辣！", type: MessageBarType.success}))
                        .catch(() => setMessage({message: "复制失败……不要恐慌，解除隐藏之后手动复制吧。", type: MessageBarType.warning}))
                    }
                    }>
                        复制
                    </PrimaryButton>
                </Stack.Item>
            </Stack>
            ]}

            {error && <ErrorNotification error={error} />}
        </Stack>
    )
}