import { Pivot, PivotItem, IStyleSet, ILabelStyles, Text, Stack, DefaultPalette, FontIcon, IconNames } from '@fluentui/react'
import Client from '../lib/miniclient'
import UserCard from '../components/usercard'
import StreamCode from '../components/streamcode';
import Title from '../components/title';
import ChangePassword from '../components/change-password';
import styles from '../lib/styles';
import { useContext } from 'react';
import MinitubeContext from '../lib/global';
import FollowerList from '../components/follower-list';
import FollowingList from '../components/following-list';



export default function Home() {
    const { client } = useContext(MinitubeContext)
    const items = {
        '我的推流码': StreamCode,
        '修改密码': ChangePassword,
        '关注我的': FollowerList,
        '我关注的': FollowingList
    }


    return (<Stack horizontal tokens={{childrenGap: 48}}>
        <Stack.Item grow styles={{ root: { maxWidth: 500 } }}>
            <UserCard></UserCard>
        </Stack.Item>
        <Stack.Item grow>
            <Pivot>
                {Object.entries(items).map(([title, Component]) => {
                    return (
                    <PivotItem headerText={title} key={title}>
                        <div style={{marginTop: 12}}><Component></Component></div>
                    </PivotItem>)
                })}
            </Pivot>
        </Stack.Item>
    </Stack>)
}