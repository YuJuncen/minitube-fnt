import { CSSProperties, useState, useEffect, useCallback } from "react";
import { Overlay, Stack, IconButton, IconNames, mergeStyles, DefaultPalette, IIconProps, TextField, TooltipHost } from "@fluentui/react";
import styles from "../lib/styles";
import ToggleButtonWithTooltip from "./toggle-button";
import utils from "../lib/utils";
import { isFunction } from "util";

interface IPlayerLayerControls {
    onPause: () => void | Promise<void>,
    onPlay: () => void | Promise<void>,
    onDisableDanmaku: () => void,
    onEnableDanmaku: () => void,
    onFullScreen: () => void,
    onBackToWindow: () => void,
    onSendDanmaku: ({ content: string }) => void,
    onReload: () => void,
    danmakuIsOn: boolean
}


export default function PlayerLayer({ ...events }: Partial<IPlayerLayerControls>) {
    const [fullScreen, setFullScreen] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [danmakuOn, setDanmakuOn] = useState(true)
    const [pausing, setPausing] = useState(false)
    const [danmaku, setDanmaku] = useState('')
    useEffect(() => {
        document.addEventListener('fullscreenchange', (event) => {
            setFullScreen(document.fullscreenElement != null)
        })
    }, [])
    const iconClass = mergeStyles({
        color: DefaultPalette.themeDarker,
    })
    const playBarClass = mergeStyles({
        transition: "all .5s",
        opacity: 0,
        selectors: {
            '&:hover': {
                opacity: 1
            }
        }
    })
    const sendDanmaku = useCallback(() => {
        events?.onSendDanmaku?.call(this, { content: danmaku })
        setDanmaku('')
    }, [danmaku])
    const getIconProps = (name: string): IIconProps => {
        return { iconName: name, className: iconClass }
    }
    const coverClass = mergeStyles({
        selectors: {
            '&:hover': {
                cursor: "pointer"
            }
        }
    })
    return <Stack style={{
        ...styles.growToMax,
        borderRadius: '4px'
    }} verticalAlign="end" 
    className={playing ? '' : coverClass}
    onClick={async () => {
        if (!playing && events.onPlay) {
            try {
                await events.onPlay()
                setPausing(true)
                setPlaying(true)
            } finally {
                setPausing(false)
            }
        }
    }}>
        <Stack.Item key="content" align="end"
            tokens={{ margin: 8, padding: 16 }}
            className={playBarClass}
            styles={{ root: { width: 'calc(100% - 16px)', borderRadius: '2px', backgroundColor: "#ffffffcc", backdropFilter: "blur(4px)" } }}>
            <Stack horizontal style={styles.growToHMax} horizontalAlign="end" styles={{}}>
                <Stack.Item key="pause" align="start">
                    <ToggleButtonWithTooltip
                        tooltip={playing => playing ? '暂停' : '播放'}
                        on={getIconProps('Pause')}
                        off={getIconProps('Play')}
                        disabled={pausing}
                        onToggle={async isPlaying => {
                            setPausing(true)
                            try {
                                if (isPlaying && events.onPause) {
                                    await events.onPause()
                                }
                                if (!isPlaying && events.onPlay) {
                                    await events.onPlay()
                                }
                            } finally {
                                setPausing(false)
                            }
                        }}
                        model={{ value: playing, setModel: setPlaying }} />
                </Stack.Item>
                <Stack.Item key="reload">
                    <TooltipHost id='id-reload' content={'重新加载'}>
                        <IconButton
                            onClick={() => {
                                if (events.onReload) {
                                    events.onReload()
                                }
                                setPausing(false)
                                setPlaying(false)
                            }}
                            iconProps={getIconProps('Refresh')}
                        >
                        </IconButton>
                    </TooltipHost>

                </Stack.Item>

                {fullScreen && events.danmakuIsOn ? [
                    <Stack.Item key="gap" grow>
                        <TextField placeholder="发送弹幕!" borderless value={danmaku} 
                        onKeyUp={(e) => danmaku.length && e.key == 'Enter' && sendDanmaku()}
                        onChange={(_, v) => setDanmaku(v)}></TextField>
                    </Stack.Item>,
                    <Stack.Item key="send">
                        <IconButton disabled={danmaku.length == 0} iconProps={{ iconName: "Send" }} onClick={sendDanmaku}></IconButton>
                    </Stack.Item>] :
                    <Stack.Item grow><div style={styles.growToHMax}></div></Stack.Item>
                }
                <Stack.Item key="danmaku" align="end">
                    <ToggleButtonWithTooltip
                        tooltip={danmakuOn => danmakuOn ? '关闭弹幕' : '开启弹幕'}
                        on={getIconProps("MessageFill")}
                        off={getIconProps("Message")}
                        onToggle={isDanmakuOn => {
                            if (isDanmakuOn && events.onDisableDanmaku) {
                                events.onDisableDanmaku()
                            }
                            if (!isDanmakuOn && events.onEnableDanmaku) {
                                events.onEnableDanmaku()
                            }
                        }}
                        model={{ value: danmakuOn, setModel: setDanmakuOn }}
                    />
                </Stack.Item>
                <Stack.Item key="fullscreen" align="end">
                    <ToggleButtonWithTooltip
                        tooltip={fullScreen => fullScreen ? '退出全屏' : '全屏'}
                        on={getIconProps('BackToWindow')}
                        off={getIconProps('FullScreen')}
                        onToggle={isFullScreen => {
                            if (isFullScreen && events.onBackToWindow) {
                                events.onBackToWindow()
                            }
                            if (!isFullScreen && events.onFullScreen) {
                                events.onFullScreen()
                            }
                        }}
                        model={{
                            value: fullScreen,
                            setModel: setFullScreen
                        }} />
                </Stack.Item>
            </Stack>
        </Stack.Item>
    </Stack>
}