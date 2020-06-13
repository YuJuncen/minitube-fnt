import { useState, useEffect, useRef } from "react";
import { ICardTokens } from "@uifabric/react-cards";
import { Stack, MessageBar, MessageBarType, IStackProps, Shimmer, TextField, Toggle } from "@fluentui/react"
import Client from "../lib/miniclient";
import errors from "../lib/errors";
import { IStackTokens } from "@fluentui/react/lib-commonjs/Stack";

const OK = 200

export default function StreamCode({client, ...props}: {client: Client} & IStackProps) {
    const [code, setCode] = useState('')
    const [error, setError] = useState(null)
    const [hidden, setHidden] = useState(true)
    useEffect(() => {
        (async () => {
            const codeResponse = await client.streamCode('mgw')
            console.log(codeResponse)
            if (codeResponse.code != OK) {
                setError(codeResponse.message)
                return
            }
            setCode(codeResponse.key)
        })()
        return () => { }
    })
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
                messageBarType={MessageBarType.success}
                truncated={true}
            >
                <b>已经获得推流码！</b>
            </MessageBar>,
            <Stack verticalAlign="space-between" >
                <Stack.Item>
                    <Toggle label="隐藏推流码" defaultChecked onChange={(_, v) => setHidden(v)} />
                </Stack.Item>
                <Stack.Item grow={1}>
                    <TextField type={hidden ? 'password' : 'text'} value={code} label="推流码" readOnly></TextField>
                </Stack.Item>
            </Stack>
            ]}

            {error && <MessageBar
                messageBarType={MessageBarType.error}
            >
                <b>出现错误：</b>{errors.messageBy(error)}
                </MessageBar>}
        </Stack>
    )
}