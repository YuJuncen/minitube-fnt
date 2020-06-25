import { Stack, DefaultPalette, FontIcon, Text } from "@fluentui/react";
import styles from "../lib/styles";

export default function PlaceHolder({text, icon} : {text: string, icon: string}) {
    return <Stack style={
        { ...styles.growToMax, height: '50vh', border: 'dashed', borderColor: DefaultPalette.neutralLight, marginTop: '1vh' }
        } horizontalAlign="center" verticalAlign="center">
        <Stack.Item>
            <FontIcon style={{ color: DefaultPalette.neutralLight, fontSize: "6em" }} iconName={icon}>
            </FontIcon>
        </Stack.Item>
        <Stack.Item key="empty">
            <Text variant="xxLarge" style={{ color: DefaultPalette.neutralLight }}>{text}</Text>
        </Stack.Item>
    </Stack>
}