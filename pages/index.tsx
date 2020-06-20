import Client from "../lib/miniclient";
import { useState, useEffect, useCallback } from "react";
import { LiveProfile } from "../lib/modles";
import { List } from "@fluentui/react";
import LiveCard from "../components/live-card";

export default function Index() {
    const client = Client.global()
    const [lives, setLives] = useState<LiveProfile[]>()
    useEffect(() => {
        client.getRandomLiveRooms(10)
            .then(lives => {
                if (Client.isOK(lives)) {
                    setLives(lives.users)
                    return
                }
                console.log("工-口发生: ", lives);
            })
    })
    const renderLive = useCallback((live: LiveProfile) => {
        return <LiveCard live={live}></LiveCard>
    }, [])
    return <List items={lives} onRenderCell={renderLive}></List>
}