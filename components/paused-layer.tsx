import { Stack, DefaultPalette, FontIcon } from "@fluentui/react";
import styles from "../lib/styles";


export default function PausedLayer() {
    return <Stack style={{...styles.overlay, 
        backgroundColor: DefaultPalette.blackTranslucent40, 
        backdropFilter: 'blur(4px)'}} 
        verticalAlign="center" 
        horizontalAlign="center">
        <Stack.Item key="paused">
            <FontIcon iconName='Play' style={{fontSize: '5em', color: DefaultPalette.white}}></FontIcon>
        </Stack.Item>
    </Stack>
}