import { EventEmitter } from "events";
import { useState, CSSProperties } from "react";
import FlvJs from "flv.js";
import ErrorLayer from "./error-layer";
import LoadingLayer from "./loading-layer";
import { DefaultPalette } from "@fluentui/react";
import PausedLayer from "./paused-layer";

enum States {
    Loading,
    Playing,
    Error,
    Paused
}
const errorStyle: CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${DefaultPalette.redDark}, ${DefaultPalette.red})`,
    color: DefaultPalette.white
}

export default function StateLayer({ events } : { events: EventEmitter }) {
    const [currentState, setState] = useState<any>({state: States.Loading})
    const toError = (message: string) => {
        setState({state: States.Error, message})
    }
    const toPlaying = () => {
        setState({state: States.Playing})
    }
    const toPaused = () => {
        setState({state: States.Paused})
    }
    const toLoading = () => {
        setState({state: States.Loading})
    }
    
    events.on("loaded", toPaused)
    events.on("pause", toPaused)
    events.on("play", toPlaying)
    events.on("error", toError)
    events.on("reload", toLoading)

    console.log("state", currentState)
    if (currentState.state == States.Error) {
        return <ErrorLayer text={currentState.message} style={errorStyle}></ErrorLayer>
    }
    if (currentState.state == States.Loading) {
        return <LoadingLayer />
    }
    if (currentState.state == States.Paused) {
        return <PausedLayer />
    }
    return <></>
}