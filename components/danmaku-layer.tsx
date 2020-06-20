import { useRef, CSSProperties, useEffect } from "react"
import { EventEmitter } from "events"
import { nextTick } from "process"
import next from "next"

export default function DanmakuLayer({ source }: { source: EventEmitter }) {
    const ref = useRef<HTMLDivElement>(null)
    const styles: CSSProperties = {
        'width': '100%',
        'height': '100%',
        'position': 'relative',
        'overflow': 'hidden'
    }
    const createDanmu = ({ size, color, content }): HTMLSpanElement => {
        const ele = document.createElement('span')
        ele.style.fontSize = size
        ele.style.color = color
        ele.style.position = 'absolute'
        ele.style.top = `${Math.round(Math.random() * 50)}%`
        ele.style.left = '100%'
        ele.style.fontFamily = "苹方, 'Noto Sans', sans"
        ele.style.zIndex = '100'
        ele.style.textOverflow = 'auto'
        ele.style.width = `${content.length}em`
        ele.style.textShadow = [0, -1, 1].flatMap(x => [0, -1, 1].map(y => `${x}px ${y}px 0px #000`)).join(',')
        ele.textContent = content
        return ele
    }
    const runDanmu = (ele: HTMLSpanElement, time: number, on: HTMLUnknownElement) => {
        on.appendChild(ele)
        setTimeout(() => {
            ele.style.transition = `all ${time}ms linear`
            ele.style.transform = `translateX(-${on.clientWidth}px) translateX(-100%)`
        }, 0)
        setTimeout(() => on.removeChild(ele), time)

    }
    useEffect(() => {
        const listener = ({ size, color, content, ...props }) => {
            if (ref.current == null) { return }
            const danmaku = createDanmu({ size, color, content })
            const baseTime = 7000
            const diffTime = Math.round(Math.random() * 3000)
            runDanmu(danmaku, baseTime + diffTime, ref.current)
        }
        source.on('danmaku', listener)
        return () => source.off('danmaku', listener)
    }, [])
    return <div ref={ref} style={styles}></div>
}