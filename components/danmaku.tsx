import { Card } from "@uifabric/react-cards";
import { DateTime, Duration } from 'luxon';
import { ActivityItem, Stack, TextField, IconButton, Separator, ColorClassNames, DefaultPalette, IList, ScrollToMode } from "@fluentui/react";
import * as Fluent from '@fluentui/react';
import * as timeago from 'timeago.js';
import { useState, useEffect, useCallback, useRef } from "react";
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
    const listRef = useRef<IList>();
    useEffect(() => {
        const onDanmaku = (d: Danmaku) => {
            setDanmaku(danmaku => danmaku.push(d))
        }
        danmakus.on('danmaku', onDanmaku)
        return () => danmakus.off('danmaku', onDanmaku)
    }, [])
    const renderDanmaku = useCallback((d: Danmaku, n) => {
        return <ActivityItem
            key={n}
            activityDescriptionText={`${d.user.username} 说:`}
            commentText={d.content}
            timeStamp={timeago.format(d.time, 'zh_CN')}
            activityPersonas={[{ text: d.user.username, imageInitials: 'U' }]}
        />
    }, [])
    return (
        <Card tokens={{ padding: 's1 s1', maxHeight: '75vh' }}>
            <Card.Item styles={{ root: { height: '100%' } }}>
                <Stack styles={{ root: { height: '100%' } }}>
                    <Stack.Item grow={1} styles={{ root: { maxHeight: '100%', overflowY: 'auto' } }}>
                       <Fluent.List
                        componentRef={listRef} 
                        items={danmaku.takeLast(20).toArray()}
                        onRenderCell={renderDanmaku}
                       />
                    </Stack.Item>
                    <Separator title="发送弹幕!"></Separator>
                    <Stack.Item>
                        <Stack horizontal tokens={{ childrenGap: 's1' }}>
                            <Stack.Item key="sending">
                                <TextField placeholder={currentUser == null ? "登录后就可以发送弹幕了哦!" : "发送弹幕!"}
                                    value={userDanmaku}
                                    borderless
                                    disabled={currentUser==null}
                                    style={styles.growToHMax}
                                    onChange={(_, v) => setUserDanmu(v)}
                                ></TextField>
                            </Stack.Item>
                            <Stack.Item key="sendbutton">
                                <IconButton
                                    disabled={userDanmaku.length == 0 || currentUser==null}
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