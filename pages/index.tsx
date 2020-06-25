import Client from "../lib/miniclient";
import { useState, useEffect, useCallback, useContext } from "react";
import models, { LiveProfile, Profile } from "../lib/models";
import { List, Stack, Text, DefaultPalette, FontIcon, IconNames, IconButton, ActionButton, Spinner, Separator, Icon } from "@fluentui/react";
import LiveCard from "../components/live-card";
import styles from "../lib/styles";
import MinitubeContext from "../lib/global";
import utils from "../lib/utils";
import PlaceHolder from "../components/placeholder";

function multiList<T>(l: T[]): T[] {
    if (!l?.length) return []
    let result = [];
    for (let i = 0; i < 1; i++) {
        result.push(...l)
    }
    return result
}

export default function Index() {
    const { client, user } = useContext(MinitubeContext)
    const [lives, setLives] = useState<LiveProfile[]>([])
    const [historyLives, setHistoryLives] = useState<LiveProfile[]>()
    const [followingLives, setFollowingLives] = useState<LiveProfile[]>()
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
    const fetchHistory = useCallback(() => {
        if (user == models.defaultUser) { return }
        client.getHistory().then(async his => {
            if (Client.isOK(his)) {
                const result: (LiveProfile & {timestamp: number})[] = []
                for (const h of his.history) {
                    if (result.length > 12) return
                    const live = await client.getProfileOf(h.username)
                    if (Client.isOK(live) && live.user.living) {
                        result.push({ ...live.user, timestamp: h.timestamp})
                    }
                }
                result.sort((a, b) => b.timestamp - a.timestamp)
                setHistoryLives(result)
                return
            }
            setHistoryLives([])
        })
    }, [user])
    const fetchFollowing = useCallback(() => {
        if (user == models.defaultUser) { return }
        client.followingOf(user.username).then(async following => {
            if (Client.isFail(following)) {
                setFollowingLives([])
                return
            }
            const lives = following.followings
            lives.sort((a, b) => b.watching - a.watching)
            setFollowingLives(lives.slice(0, 12).filter(l => l.living))
        })
    }, [user])
    useEffect(() => {
        fetchNewBatch()
    }, [])
    useEffect(() => {
        fetchHistory()
        fetchFollowing()
    }, [user])
    const renderLive = useCallback((live: LiveProfile, idx: number) => {
        return <Stack.Item grow key={`item-${idx}`}> <LiveCard live={live}></LiveCard> </Stack.Item>
    }, [])
    return <>
        {followingLives?.length > 0 && [
            <Text variant="xLarge" style={{ color: DefaultPalette.neutralDark }}>你喜欢的主播就在这里！</Text>,
            <Stack horizontal wrap tokens={{ childrenGap: '8px' }}>{followingLives.map(renderLive)}</Stack>,
            <Separator />]
        }
        <Text variant="xLarge" style={{ color: DefaultPalette.neutralDark }}>{`${historyLives?.length > 0 || followingLives?.length > 0 ? '' : '欢迎来到 MiniTube，'}来试试看手气？`}</Text>
        <ActionButton iconProps={{ iconName: 'Refresh' }}
            styles={{ 'label': { color: DefaultPalette.themePrimary }, 'labelDisabled': { color: DefaultPalette.neutralLight } }}
            disabled={refreshing}
            onClick={fetchNewBatch}>换一批</ActionButton>
        {lives?.length > 0 ?
            <Stack horizontal wrap tokens={{ childrenGap: '8px' }}>{lives.map(renderLive)}</Stack> :
            <PlaceHolder text="没有人在直播——好惨一平台！" icon={'EmojiDisappointed'} />
        }
        <Separator />
        {historyLives?.length > 0 && [
            <Text variant="xLarge" style={{ color: DefaultPalette.neutralDark }}>再看看以前看过的主播？</Text>,
            <Stack horizontal wrap tokens={{ childrenGap: '8px' }}>{historyLives.map(renderLive)}</Stack>]
        }
    </>
}