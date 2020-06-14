import { CSSProperties } from "react";
import { Stack, FontIcon, Text, IStackProps } from "@fluentui/react";

export default function ErrorLayer({ text, ...props }: { text: string } & IStackProps) {
    const iconStyle: CSSProperties = {
        fontSize: '10vh',
        fontWeight: 'bolder'
    }

    return (
        <Stack {...props} tokens={{childrenGap: 12}} verticalAlign='center' horizontalAlign='center'>
            <Stack.Item>
                <FontIcon iconName="Blocked2" style={iconStyle}></FontIcon>
            </Stack.Item>
            <Stack.Item>
                <Text variant='xLargePlus'>{text}</Text>
            </Stack.Item>
        </Stack>
    )
}