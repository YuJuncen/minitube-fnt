import { useState } from "react"

function startWork(work: () => Promise<any>, begin: () => () => void) {
    const end = begin()
    work().finally(end)
}

function useWork() : [boolean, () => () => void]{
    const [working, setWorking] = useState(false)
    const manager = () => {
        setWorking(true)
        return () => setWorking(false)
    }
    return [working, manager]
}

export default { startWork, useWork }