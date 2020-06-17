import { CSSProperties } from "react";
import { Stack, FontIcon, Text, IStackProps, Overlay } from "@fluentui/react";

export default function ErrorLayer({ text, ...props }: { text: string } & IStackProps) {
    const iconStyle: CSSProperties = {
        fontSize: '10vh',
        fontWeight: 'bolder'
    }
    const layerStyle: CSSProperties = {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute'
    }

    return (
        <Stack {...props} tokens={{childrenGap: 12}} verticalAlign='center' horizontalAlign='center' style={{...props.style, ...layerStyle}}>
            <Stack.Item>
                <FontIcon iconName="Error" style={iconStyle}></FontIcon>
            </Stack.Item>
            <Stack.Item>
                <Text variant='xLargePlus'>{text}</Text>
            </Stack.Item>
        </Stack>
    )
}