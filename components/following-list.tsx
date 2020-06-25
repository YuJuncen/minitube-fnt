import { useEffect, useContext, useState } from "react";
import MinitubeContext from "../lib/global";
import FollowList from "./follow-list";
import Client from "../lib/miniclient";
import PlaceHolder from "./placeholder";
import { IconNames, Shimmer } from "@fluentui/react";

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
        <FollowList users={followings} action="取消关注" onAction={(user) => {client.unfollow(user.username)}}></FollowList>
}