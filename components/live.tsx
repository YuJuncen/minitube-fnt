import flvjs from 'flv.js'
import { useRef, useEffect, CSSProperties, useMemo, useState, useContext } from 'react'
import Client from '../lib/miniclient'
import DanmakuLayer from './danmaku-layer'
import { EventEmitter } from 'events'
import PlayerLayer from './player-layer'
import StateLayer from './state-manager'
import styles from '../lib/styles'
import { DateTime } from 'luxon'
import models, { User } from '../lib/models'
import { platform } from 'os'
import utils from '../lib/utils'
import MinitubeContext from '../lib/global'

const overlayContainer: CSSProperties = { position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', overflow: 'hidden', zIndex: 1000 }

export default function Live({ danmakuEvents, streamer }: { streamer: string, danmakuEvents: EventEmitter }) {
    const {user} = useContext(MinitubeContext)
    const ref = useRef<HTMLVideoElement>()
    const playerRef = useRef<HTMLDivElement>()
    const cli = Client.global()
    const makePlayer = () => flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: cli.pullStreamAPIFor(streamer)
    })
    const [player, setPlayer] = useState<flvjs.Player>(makePlayer)
    const playerEvents = new EventEmitter()
    const [danmakuOn, setDanmakuOn] = useState(true)

    useEffect(() => {
        player.attachMediaElement(ref.current)
        player.load()
        player.on(flvjs.Events.ERROR, (errorType, detail, messages) => {
            if (messages.code == 404) {
                playerEvents.emit('error', `主播可能不存在哦！`)
            } else {
                console.log("获取直播源出现未知错误: ", errorType, detail, messages)
                playerEvents.emit('error', `获取直播源出现未知错误, 请前往控制台查看详细信息...`)
            }
        })
        player.on(flvjs.Events.METADATA_ARRIVED, (...args) => {
            console.log(args);
            playerEvents.emit('loaded')
        })
        return () => {
            if (player != null) {
                player.destroy()
            }
        }
    }, [player])
    const playerStyle: CSSProperties = {
        height: '75vh',
        width: '133.33vh'
    }

    return (<div ref={playerRef} style={{ position: 'relative', ...playerStyle }}>
        { danmakuOn && <div style={{ ...overlayContainer, zIndex: 1001 }}>
            <DanmakuLayer source={danmakuEvents}></DanmakuLayer>
</div> }
        <div style={overlayContainer}>
            <StateLayer events={playerEvents} />
        </div>
        <div style={{ ...overlayContainer, zIndex: 1002 }}>
            <PlayerLayer
                onPause={() => {
                    player?.pause()
                    playerEvents.emit('pause')
                }}
                onPlay={() => {
                    player?.play()
                    playerEvents.emit('play')
                }}
                onReload={() => {
                    player?.pause()
                    playerEvents.emit('reload')
                    player?.unload()
                    player?.detachMediaElement()
                    setPlayer(makePlayer())
                }}
                onEnableDanmaku={() => setDanmakuOn(true)}
                onDisableDanmaku={() => setDanmakuOn(false)}
                onFullScreen={() => playerRef.current.requestFullscreen()}
                onBackToWindow={() => document.exitFullscreen()}
                danmakuIsOn={user != models.defaultUser}
                onSendDanmaku={({content}) => danmakuEvents.emit('danmaku', utils.makeDanmaku(content, user.username))}
            ></PlayerLayer> 
        </div>
        <video ref={ref} controls={false} style={styles.growToMax}></video>
    </div>
    )
}