import { Card } from "@uifabric/react-cards";
import { DateTime, Duration } from 'luxon';
import { ActivityItem, Stack, TextField, IconButton, Separator, ColorClassNames, DefaultPalette } from "@fluentui/react";
import * as timeago from 'timeago.js';
import { useState, useEffect } from "react";
import { List } from 'immutable';
import { EventEmitter } from "events";
import { Danmaku } from "../lib/modles";
import styles from "../lib/styles";

export default function DanmakuList({ danmakus, currentUser }: { danmakus: EventEmitter, currentUser: { username: string, avatar: string } }) {
    const [danmaku, setDanmaku] = useState(List([]))
    const [userDanmaku, setUserDanmu] = useState('')
    const pushDanmaku = (content: string) => {
        const fakeDanmu = { user: { username: currentUser.username }, time: DateTime.local().toString(), content, size: '28px', color: DefaultPalette.themePrimary }
        danmakus.emit('danmaku', fakeDanmu)
    }
    useEffect(() => {
        const onDanmaku = (d: Danmaku) => {
            setDanmaku(danmaku => danmaku.push(d))
        }
        danmakus.on('danmaku', onDanmaku)
        return () => danmakus.off('danmaku', onDanmaku)
    }, [])

    return (
        <Card tokens={{ padding: 's1 s1', maxHeight: '75vh' }}>
            <Card.Item styles={{ root: { height: '100%' } }}>
                <Stack styles={{ root: { height: '100%' } }}>
                    <Stack.Item grow={1} styles={{ root: { maxHeight: '100%', overflowY: 'auto' } }}>
                        <div></div>
                        {danmaku.takeLast(10).map((d: Danmaku, n) => (
                            <ActivityItem
                                key={n}
                                activityDescriptionText={`${d.user.username} 说:`}
                                commentText={d.content}
                                timeStamp={timeago.format(d.time, 'zh_CN')}
                                activityPersonas={[{ text: d.user.username, imageInitials: 'U' }]}
                            />
                        ))}
                    </Stack.Item>
                    <Separator title="发送弹幕!"></Separator>
                    <Stack.Item>
                        <Stack horizontal tokens={{ childrenGap: 's1' }}>
                            <Stack.Item key="sending">
                                <TextField placeholder="发送弹幕!"
                                    value={userDanmaku}
                                    borderless
                                    style={styles.growToHMax}
                                    onChange={(_, v) => setUserDanmu(v)}
                                ></TextField>
                            </Stack.Item>
                            <Stack.Item key="sendbutton">
                                <IconButton
                                    disabled={userDanmaku.length == 0}
                                    iconProps={{ iconName: 'Send' }}
                                    onClick={() => {
                                        pushDanmaku(userDanmaku)
                                        setUserDanmu('')
                                    }}></IconButton>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                </Stack>
            </Card.Item>
        </Card>
    )
}