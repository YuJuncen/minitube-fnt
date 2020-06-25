import { useEffect, useContext, useState } from "react";
import MinitubeContext from "../lib/global";
import FollowList from "./follow-list";
import Client from "../lib/miniclient";
import PlaceHolder from "./placeholder";
import { IconNames, Shimmer, Stack } from "@fluentui/react";
import LiveCard from "./live-card";

export default function FollowingList() {
    const {client, user} = useContext(MinitubeContext)
    const [followings, setFollowings] = useState(null)
    useEffect(() => {
        client.followingOf(user.username)
            .then(u => {
                if (Client.isOK(u)) {
                    setFollowings(u.followings)
                }
            })
    }, [user])
    
    return followings == null ?
    <Shimmer></Shimmer> :
    followings.length == 0 ? 
    <PlaceHolder text="你没有关注任何人" icon='Balloons'></PlaceHolder> :
       <Stack horizontal wrap tokens={{childrenGap: 12}}>
           {followings.map((l, i) => {
               return <Stack.Item styles={{root: {width: 'calc(50% - 12px)'}}} key={`${i}-follow`}>
                   <LiveCard style={{height: "100%"}} live={l}></LiveCard>
               </Stack.Item>
           }) }
       </Stack>
}