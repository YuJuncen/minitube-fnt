import flvjs from 'flv.js'
import { useRef, useEffect } from 'react'
import Client from '../lib/miniclient'

export default function Live() {
    const ref = useRef()
    const cli = Client.global()
    const player = flvjs.createPlayer({
        type: 'flv',
        url: cli.pullStreamAPIFor('mgw')
    })
    useEffect(() => {
        player.attachMediaElement(ref.current)
        player.load()
        player.play()
        return () => player.destroy()
    }, [])

    return <video ref={ref} controls={true}></video>
}