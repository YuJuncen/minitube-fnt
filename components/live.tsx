import flvjs from 'flv.js'
import { useRef, useEffect, useState, CSSProperties } from 'react'
import Client from '../lib/miniclient'
import { Overlay, DefaultPalette } from '@fluentui/react'
import ErrorLayer from './errorlayer'
import DanmuList from './danmu'
import DanmuLayer from './danmulayer'
import { EventEmitter } from 'events'

const overlayContainer : CSSProperties= {position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', overflow: 'hidden'}

export default function Live() {
    const ref = useRef()
    const cli = Client.global()
    const player = flvjs.createPlayer({
        type: 'flv',
        url: cli.pullStreamAPIFor('mgw')
    })
    const [err, setErr] = useState<{ code: number, message: string }>(null)
    useEffect(() => {
        player.attachMediaElement(ref.current)
        player.load()
        player.on(flvjs.Events.ERROR, (...args) => console.log(args))
        player.on(flvjs.Events.LOADING_COMPLETE, (...args) => {
            console.log(args);
            const ply = player.play();
            if (ply instanceof Promise) {
                ply.catch(e => console.log(e))
            }
        })
        return () => player.destroy()
    }, [])
    const playerStyle: CSSProperties = {
        height: '75vh',
        width: '133.33vh'
    }
    const errorStyle: CSSProperties = {
        backgroundImage: `linear-gradient(to right, ${DefaultPalette.redDark}, ${DefaultPalette.red})`,
        color: DefaultPalette.white
    }
    const emitter = new EventEmitter()
    useEffect(() => {
        emitter.emit('danmu', {size: '28px', color: '#ffffff', content: 'hello, world!'})
        const danmus = setInterval(() => emitter.emit('danmu', {size: '28px', color: '#ffffff', content: `yan 太强了!`}), 1000)
        return () => clearInterval(danmus)
    })

    return (<div style={{position: 'relative'}}>
        <div style={overlayContainer}>
            <DanmuLayer source={emitter}></DanmuLayer>
        </div>
    {
        err ?
            <ErrorLayer text={err.message} color="#123456" style={{ ...playerStyle, ...errorStyle }}></ErrorLayer> :
            <video ref={ref} controls={true} style={playerStyle}></video>
    }
    </div>
    )
}