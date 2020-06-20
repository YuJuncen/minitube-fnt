import { Stack, IStackProps, Text } from "@fluentui/react";
import { ITextProps } from "@fluentui/react/lib-commonjs/Text";

export default function Title({ text, title, minitube }: { text: string, title?: ITextProps, minitube?: ITextProps}) {
    return (
        <Stack horizontal verticalAlign='baseline' tokens={{childrenGap: 8}}>
            <Text variant='xxLargePlus' {...(title || {})}>{text}</Text>
            <Text variant="mediumPlus" {...(minitube || {})}>minitube</Text>
        </Stack>
    )
}