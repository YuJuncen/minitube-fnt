import { useEffect, useContext, useState } from "react";
import MinitubeContext from "../lib/global";
import FollowList from "./follow-list";
import Client from "../lib/miniclient";
import PlaceHolder from "./placeholder";
import { IconNames, Shimmer } from "@fluentui/react";

export default function FollowerList() {
    const {client, user} = useContext(MinitubeContext)
    const [followers, setFollowers] = useState(null)
    useEffect(() => {
        client.followerOf(user.username)
            .then(u => {
                if (Client.isOK(u)) {
                    setFollowers(u.followers)
                }
            })
    }, [user])
    
    return followers == null ?
        <Shimmer></Shimmer> :
    followers.length == 0 ? 
    <PlaceHolder text="你没有被任何人关注" icon='Balloons'></PlaceHolder> :
        <FollowList users={followers} action="关注回去" onAction={user => client.followTo(user.username)}></FollowList>
        
}