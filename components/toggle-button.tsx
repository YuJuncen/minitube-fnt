import { IIconProps, IButtonProps, IconButton, TooltipHost } from "@fluentui/react";
import { useState } from "react";
import { useId } from "@uifabric/react-hooks";
interface IToggleButtonProps {
    on: IIconProps,
    off: IIconProps, 
    defaultOn? : boolean,
    tooltip?: (state: boolean) => string,
    onToggle?: (lastState: boolean) => void
}


export default function ToggleButtonWithTooltip({defaultOn, on, off, tooltip, onToggle, ...props} : IToggleButtonProps & IButtonProps) {
    const [isOn, setOn] = useState(defaultOn)
    const id = useId("toggle-button-with-tooltip")
    return <TooltipHost id={id} content={tooltip(isOn)}>
            <IconButton
            onClick={() => {
                setOn(o => {
                    if (onToggle) {
                        onToggle(o)
                    }
                    return !o
                })
            }} 
            iconProps={isOn ? on : off}
            {...props}
            >
            </IconButton>
        </TooltipHost>
}