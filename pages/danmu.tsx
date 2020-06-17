import PlayerLayer from "../components/player-layer";
import { Stack } from "@fluentui/react";
import LoadingLayer from "../components/loading-layer";

export default function Danmu() {
    return <Stack style={{height: '80vh', width: '80vw' , margin: '0', padding: '0'}}>
        <LoadingLayer />
    </Stack>
}