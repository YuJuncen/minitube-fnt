import Client from "../lib/miniclient";
import { useState, useEffect, useCallback, useContext } from "react";
import { LiveProfile } from "../lib/models";
import { List, Stack, Text, DefaultPalette, FontIcon, IconNames, IconButton, ActionButton, Spinner } from "@fluentui/react";
import LiveCard from "../components/live-card";
import styles from "../lib/styles";
import MinitubeContext from "../lib/global";
import utils from "../lib/utils";

function multiList<T>(l: T[]): T[] {
    if (!l?.length) return []
    let result = [];
    for (let i = 0; i < 1; i++) {
        result.push(...l)
    }
    return result
}

export default function Index() {
    const { client } = useContext(MinitubeContext)
    const [lives, setLives] = useState<LiveProfile[]>([])
    const [refreshing, manager] = utils.useWork()
    const fetchNewBatch = useCallback(() => {
        const fetching = () => client.getRandomLiveRooms(12).then(lives => {
            if (Client.isOK(lives)) {
                const livesList = multiList(lives.users);
                console.log(livesList)
                setLives(livesList)
                return
            }
            console.log("工-口发生: ", lives);
        });
        utils.startWork(fetching, manager)
    }, [])
    useEffect(() => {
       fetchNewBatch()
    }, [])
    const renderLive = useCallback((live: LiveProfile, idx: number) => {
        return <Stack.Item grow key={`item-${idx}`}> <LiveCard live={live}></LiveCard> </Stack.Item>
    }, [])
    return <>
        <Text variant="xLarge" style={{color: DefaultPalette.neutralDark}}>欢迎来到 MiniTube，来试试看手气？</Text>
        <ActionButton iconProps={{iconName: 'Refresh'}} 
        styles={{'label': {color: DefaultPalette.themePrimary}, 'labelDisabled': {color: DefaultPalette.neutralLight}}}
         disabled={refreshing} 
        onClick={fetchNewBatch}>换一批</ActionButton>
        {lives?.length > 0 ?
            <Stack horizontal wrap tokens={{ childrenGap: '8px' }}>{lives.map(renderLive)}</Stack> :
            <Stack style={{ ...styles.growToMax, height: '50vh', border: 'dashed', borderColor: DefaultPalette.themeLight, marginTop: '1vh' }} horizontalAlign="center" verticalAlign="center">
                <Stack.Item>
                    <FontIcon style={{ color: DefaultPalette.themePrimary, fontSize: "6em" }} iconName={'Balloons'}>
                    </FontIcon>
                </Stack.Item>
                <Stack.Item key="empty">
                    <Text variant="xxLarge" style={{ color: DefaultPalette.themePrimary }}>没有直播了！</Text>
                </Stack.Item>
            </Stack>
        }
    </>
}