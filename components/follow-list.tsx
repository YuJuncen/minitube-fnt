import { LiveProfile } from "../lib/models";
import { Stack, IPersonaProps, Persona, DefaultButton } from "@fluentui/react";
import UserPersona from "./user-persona";
import { IButtonProps } from "@fluentui/react/lib-commonjs/Button";

export default function FollowList({users, onAction, action, buttonProps}: {
    users: LiveProfile[], 
    onAction?: (user: LiveProfile) => void, 
    action?: string, 
    actionDisabled?: boolean,
    buttonProps?: Readonly<IButtonProps>
}) {
    return <Stack tokens={{childrenGap: 12}}>
        {users.map((u, i) => {
            const someone: IPersonaProps ={
                text: u.username,
                secondaryText: u.live_name,
                tertiaryText: u.live_intro
            }
            return <Stack.Item key={i}>
                <Stack horizontal horizontalAlign="space-around" verticalAlign="center">
                    <Persona {...someone}/>
                    {action && <DefaultButton onClick={() => onAction?.call(this, u)}>{action}</DefaultButton>}
                </Stack>
            </Stack.Item>
        })}
    </Stack>
}