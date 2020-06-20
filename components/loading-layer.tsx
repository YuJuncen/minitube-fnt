import { Stack, Text, DefaultPalette, Spinner } from "@fluentui/react";
import styles from "../lib/styles";
import { useState, useEffect } from "react";

const chars = "\\|/-"

export default function LoadingLayer() {
    return <Stack style={{...styles.overlay, backgroundColor: DefaultPalette.blackTranslucent40, backdropFilter: 'blur(4px)'}} verticalAlign="center" horizontalAlign="center">
        <Stack.Item key="loading">
            <Spinner styles={{circle: {
                borderColor: `${DefaultPalette.whiteTranslucent40} ${DefaultPalette.whiteTranslucent40} ${DefaultPalette.neutralLight}`,
                height: '10em',
                width: '10em',
                borderWidth: '1em'
            }}} />
        </Stack.Item>
    </Stack>
}