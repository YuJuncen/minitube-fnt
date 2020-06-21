import { CSSProperties } from "react";
import { IStyle, DefaultPalette } from "@fluentui/react";

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

const selectedBorder : CSSProperties & IStyle = {
    border: "solid",
    borderWidth: '2px',
    borderColor: DefaultPalette.blackTranslucent40
}
export default { overlay, growToMax, growToVMax, growToHMax, selectedBorder }