import { useRef, CSSProperties } from "react"
import { EventEmitter } from "events"
import { nextTick } from "process"
import next from "next"

export default function DanmuLayer({ source }: { source: EventEmitter }) {
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
        ele.style.left = '0'
        ele.style.fontFamily = "苹方, 'Noto Sans', sans"
        ele.style.textShadow = [0, -1, 1].flatMap(x => [0, -1, 1].map(y => `${x}px ${y}px 0px #000`)).join(',')
        ele.textContent = content
        return ele
    }
    const runDanmu = (ele: HTMLSpanElement, time: number) => {
        ele.style.transform = 'translateX(100vw)'
        setTimeout(() => {
            ele.style.transition = `all ${time}ms linear`
            ele.style.transform = 'translateX(-100%)'
        }, 100)
    }
    source.on('danmu', ({ size, color, content }) => {
        const danmu = createDanmu({ size, color, content })
        ref.current.appendChild(danmu)
        const baseTime = 7000
        const diffTime = Math.round(Math.random() * 3000)
        runDanmu(danmu, baseTime + diffTime)
        setTimeout(() => ref.current.removeChild(danmu), baseTime + diffTime + 1000)
    })
    return <div ref={ref} style={styles}></div>
}