import DanmuLayer from "../components/danmulayer";
import { EventEmitter } from "events";
import { useEffect } from "react";

export default function Danmu() {
    const emitter = new EventEmitter()
    useEffect(() => {
        emitter.emit('danmu', {size: '28px', color: '#000000', content: 'hello, world!'})
        const danmus = setInterval(() => emitter.emit('danmu', {size: '28px', color: '#000000', content: `hello, world ${Date()}!`}), 100)
        return () => clearInterval(danmus)
    })
    return <div style={{height: '100vh', width: '100vw'}}><DanmuLayer source={emitter} /></div>
}