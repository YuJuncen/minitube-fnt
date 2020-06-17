import { CSSProperties } from "react";

const growToHMax : CSSProperties = {
    width: '100%'
}

const growToVMax : CSSProperties = {
    height: '100%'
}

const growToMax : CSSProperties = {
    height: '100%',
    width: '100%'
}

const overlay : CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    ...growToMax
}

export default { overlay, growToMax, growToVMax, growToHMax }