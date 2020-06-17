import flvjs from 'flv.js'
import { useRef, useEffect, CSSProperties } from 'react'
import Client from '../lib/miniclient'
import DanmakuLayer from './danmaku-layer'
import { EventEmitter } from 'events'
import PlayerLayer from './player-layer'
import StateLayer from './state-manager'
import styles from '../lib/styles'
import { DateTime } from 'luxon'

const overlayContainer : CSSProperties= {position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', overflow: 'hidden', zIndex: 1000}

export default function Live({danmakuEvents} : {danmakuEvents: EventEmitter}) {
    const ref = useRef()
    const cli = Client.global()
    const player = flvjs.createPlayer({
        type: 'flv',
        url: cli.pullStreamAPIFor('mgw')
    })
    const playerEvents = new EventEmitter()

    useEffect(() => {
        player.attachMediaElement(ref.current)
        player.load()
        player.on(flvjs.Events.ERROR, (...args) => {
            console.log("获取直播源出现未知错误: ", args)
            playerEvents.emit('error', `获取直播源出现未知错误, 请前往控制台查看详细信息...`)
        })
        player.on(flvjs.Events.METADATA_ARRIVED, (...args) => {
            console.log(args);
            const ply = player.play();
            if (ply instanceof Promise) {
                ply.catch(e => console.log("play failed" + e))
            }
            playerEvents.emit('loaded')
        })
        return () => player.destroy()
    }, [])
    const playerStyle: CSSProperties = {
        height: '75vh',
        width: '133.33vh'
    }

    return (<div style={{position: 'relative', ...playerStyle}}>
        <div style={{...overlayContainer, zIndex: 1001}}>
            <DanmakuLayer source={danmakuEvents}></DanmakuLayer>
        </div>
        <div style={overlayContainer}>
            <StateLayer events={playerEvents} />
        </div>
        <div style={{...overlayContainer, zIndex: 1002}}>
            <PlayerLayer></PlayerLayer>
        </div>
        <video ref={ref} controls={false} style={styles.growToMax}></video>
    </div>
    )
}