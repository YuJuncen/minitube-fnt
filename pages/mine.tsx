import { Pivot, PivotItem, IStyleSet, ILabelStyles, Text, Stack, DefaultPalette, FontIcon, IconNames } from '@fluentui/react'
import Client from '../lib/miniclient'
import UserCard from '../components/usercard'
import StreamCode from '../components/streamcode';
import Title from '../components/title';
import ChangePassword from '../components/change-password';
import styles from '../lib/styles';

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


    return (<Stack horizontal>
        <Stack.Item grow styles={{ root: { maxWidth: 500 } }}>
            <Pivot>
                {Object.entries(items).map(([title, Component]) => {
                    return (<PivotItem headerText={title} key={title}>
                        <Component styles={componentStyles}></Component>
                    </PivotItem>)
                })}
            </Pivot>
        </Stack.Item>
        <Stack.Item grow>
            <Stack tokens={{childrenGap: 8}} style={{ width: 'calc(100%-6vh)', margin: "3vh 0 3vh 3vh", padding: "3vh 0", border: 'dashed', borderColor: DefaultPalette.neutralLight}} horizontalAlign="center" verticalAlign="center">
                <FontIcon iconName={'FollowUser'} style={{fontSize: '10em', color: DefaultPalette.neutralLight}}></FontIcon>
                <Text variant="xLarge" style={{color: DefaultPalette.neutralLight}}>欢迎来到 Minitube！这里过不了多久就会显示您关注的人辣！</Text>
            </Stack>
        </Stack.Item>
    </Stack>)
}