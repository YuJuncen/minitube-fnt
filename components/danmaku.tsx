import { Card } from "@uifabric/react-cards";
import { DateTime, Duration } from 'luxon';
import { ActivityItem, Stack, TextField, IconButton, Separator, ColorClassNames } from "@fluentui/react";
import * as timeago from 'timeago.js';
import { useState, useEffect } from "react";
import { List } from 'immutable';

export default function DanmakuList() {
    const [danmu, setDanmu] = useState(List([]))
    const [userDanmu, setUserDanmu] = useState('')
    const pushDanmu = (content: string) => {
        const fakeDanmu = { username: "mgw", time: DateTime.local(), content }
        setDanmu(danmu.push(fakeDanmu))
    }

    return (
        <Card tokens={{ padding: 's1 s1', maxHeight: '75vh' }}>
            <Card.Item styles={{ root: { height: '100%' } }}>
                <Stack styles={{ root: { height: '100%' } }}>
                    <Stack.Item grow={1} styles={{ root: { maxHeight: '100%', overflowY: 'auto' } }}>
                        <div></div>
                        {danmu.map((danmu, n) => (
                            <ActivityItem
                                key={n}
                                activityDescriptionText={`${danmu.username} 说:`}
                                commentText={danmu.content}
                                timeStamp={timeago.format(danmu.time.toMillis(), 'zh_CN')}
                                activityPersonas={[{ text: danmu.username, imageInitials: 'U' }]}
                            />
                        ))}
                    </Stack.Item>
                    <Separator title="发送弹幕!"></Separator>
                    <Stack.Item>
                        <Stack horizontal tokens={{childrenGap: 's1'}}>
                            <Stack.Item>
                                <TextField placeholder="发送弹幕!"
                                    value={userDanmu}
                                    borderless
                                    onChange={(_, v) => setUserDanmu(v)}
                                ></TextField>
                            </Stack.Item>
                            <Stack.Item>
                                <IconButton
                                    disabled={userDanmu.length == 0}
                                    iconProps={{ iconName: 'Send' }}
                                    onClick={() => {
                                        pushDanmu(userDanmu)
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