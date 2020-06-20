import { Pivot, PivotItem, IStyleSet, ILabelStyles, Text, Stack } from '@fluentui/react'
import Client from '../lib/miniclient'
import UserCard from '../components/usercard'
import StreamCode from '../components/streamcode';
import Title from '../components/title';
import ChangePassword from '../components/change-password';

const componentStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: {
        marginTop: 10,
    },
};

export default function Home() {
    const client = Client.global()
    const items = {
        '关于我': UserCard,
        '我的推流码': StreamCode,
        '修改密码': ChangePassword,
    }


    return (<Stack horizontal horizontalAlign="center">
        <Stack.Item grow styles={{ root: { maxWidth: 500 } }}>
            <Title text="我的"></Title>
            <Pivot>
                {Object.entries(items).map(([title, Component]) => {
                    return (<PivotItem headerText={title} key={title}>
                        <Component client={client} styles={componentStyles}></Component>
                    </PivotItem>)
                })}
            </Pivot>
        </Stack.Item>
    </Stack>)
}