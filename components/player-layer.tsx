import { CSSProperties, useState } from "react";
import { Overlay, Stack, IconButton, IconNames, mergeStyles, DefaultPalette, IIconProps, TextField } from "@fluentui/react";
import styles from "../lib/styles";
import ToggleButtonWithTooltip from "./toggle-button";

interface IPlayerLayerControls {
    onPause: () => void,
    onPlay: () => void,
    onDisableDanmaku: () => void,
    onEnableDanmaku: () => void,
    onFullScreen: () => void,
    onBackToWindow: () => void,
    onSendDanmaku: ({content: string}) => void,
    onReload: () => void,
}

export default function PlayerLayer({...events} : Partial<IPlayerLayerControls>) {
    const [fullScreen, setFullScreen] = useState(false)
    const iconClass = mergeStyles({
        color: DefaultPalette.themeDarker,
    })
    const getIconProps = (name: string): IIconProps => {
        return { iconName: name, className: iconClass }
    }
    return <Stack style={{ ...styles.growToMax,
        borderRadius: '4px' }} verticalAlign="end">
        <Stack.Item key="content" align="end"
            tokens={{ margin: 8, padding: 16 }}
            styles={{ root: { width: 'calc(100% - 16px)', borderRadius: '2px', backgroundColor: "#ffffffcc", backdropFilter: "blur(4px)" } }}>
            <Stack horizontal style={styles.growToHMax} horizontalAlign="end">
                <Stack.Item key="pause" align="start">
                    <ToggleButtonWithTooltip
                        tooltip={playing => playing ? '暂停' : '播放'}
                        on={getIconProps('Pause')}
                        off={getIconProps('Play')}
                        onToggle={isPlaying => {
                            if (isPlaying && events.onPause) {
                                events.onPause()
                            }
                            if (!isPlaying && events.onPlay) {
                                events.onPlay()
                            }
                        }} />
                </Stack.Item>
                <Stack.Item key="reload">
                <ToggleButtonWithTooltip
                        tooltip={_ => '重新加载'}
                        on={getIconProps('Refresh')}
                        off={getIconProps('Refresh')} 
                        onToggle={() => {if (events.onReload) { events.onReload() }}}
                        />
                </Stack.Item>

                {fullScreen ? [
                    <Stack.Item key="gap" grow>
                        <TextField placeholder="发送弹幕!" borderless></TextField>
                    </Stack.Item>,
                    <Stack.Item key="send">
                        <IconButton iconProps={{ iconName: "Send" }}></IconButton>
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
                        />
                </Stack.Item>
                <Stack.Item key="fullscreen" align="end">
                    <ToggleButtonWithTooltip
                        tooltip={fullScreen => fullScreen ? '退出全屏' : '全屏'}
                        on={getIconProps('BackToWindow')}
                        off={getIconProps('FullScreen')}
                        onToggle={isFullScreen => {
                            setFullScreen(!isFullScreen)
                            if (isFullScreen && events.onBackToWindow) {
                                events.onBackToWindow()
                            } 
                            if (!isFullScreen && events.onFullScreen) {
                                events.onFullScreen()
                            }
                        }} />
                </Stack.Item>
            </Stack>
        </Stack.Item>
    </Stack>
}