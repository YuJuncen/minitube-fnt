import { useEffect, useContext, useState } from "react";
import MinitubeContext from "../lib/global";
import FollowList from "./follow-list";
import Client from "../lib/miniclient";
import PlaceHolder from "./placeholder";
import { IconNames, Shimmer, Stack, IPersonaProps, Persona, DefaultButton } from "@fluentui/react";
import models, { LiveProfile } from "../lib/models";
import utils from "../lib/utils";

export default function FollowerList() {
    const {client, user} = useContext(MinitubeContext)
    const [followers, setFollowers] = useState<LiveProfile[]>(null)
    useEffect(() => {
        client.followerOf(user.username)
            .then(u => {
                if (Client.isOK(u)) {
                    setFollowers(u.followers)
                }
            })
    }, [user])
    const [working, manager] = utils.useWork()

    return followers == null ?
        <Shimmer></Shimmer> :
    followers.length == 0 ? 
    <PlaceHolder text="你没有被任何人关注" icon='Balloons'></PlaceHolder> :
    <Stack tokens={{childrenGap: 12}}>
    {followers.map((u: LiveProfile, i) => {
        const someone: IPersonaProps ={
            text: u.username,
            secondaryText: u.live_name,
            tertiaryText: u.live_intro
        }
        return <Stack.Item key={i}>
            <Stack horizontal horizontalAlign="space-around" verticalAlign="center">
                <Persona {...someone}/>
                <DefaultButton disabled={u.follow == models.FollowState.FOLLOW_EACH_OTHER || working} onClick={() => 
                    utils.startWork(() => client.followTo(u.username)
                        .then(() => setFollowers(f => { f[i].follow = models.FollowState.FOLLOW_EACH_OTHER; return f; })), 
                    manager)
                }>
                    {u.follow == models.FollowState.FOLLOW_EACH_OTHER ? "互相关注" : "关注回去"}
                </DefaultButton>
            </Stack>
        </Stack.Item>
    })}
</Stack>
        
}