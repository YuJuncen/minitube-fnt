import { IPersonaProps, Persona } from "@fluentui/react";
import { User } from "../lib/modles";
import * as timeago from 'timeago.js'

export default function UserPersona({user, ...props}: IPersonaProps & {user: User}) {
    const mine: IPersonaProps ={
        text: user.username,
        secondaryText: `在 ${timeago.format(user.created_at, 'zh_CN')}加入 yantube 粉丝团`,
        tertiaryText: `UID: ${`${user.id}`.padStart(4, '0')}`
    }

    return <Persona {...mine} {...props}></Persona>
}