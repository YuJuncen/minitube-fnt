import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence, Button, Shimmer, TextField, IPersonaProps, PrimaryButton, IconNames, Stack, DefaultButton } from '@fluentui/react'
import { useState, useEffect, useContext } from 'react'
import { Card, ICardTokens, ICardProps, CardItem } from '@uifabric/react-cards'
import { useRouter } from 'next/router'
import Client from '../lib/miniclient'
import codes from '../lib/codes'
import * as timeago from 'timeago.js'
import utils, { WithValueType } from '../lib/utils'
import { ITextFieldProps } from '@fluentui/react/lib-commonjs/TextField'
import ErrorNotification from './error-notification'
import models, { User } from '../lib/models'
import UserPersona from './user-persona'
import MinitubeContext from '../lib/global'

const params: Record<'email' | 'phone' | 'live_name' | 'live_intro', [string, string, ITextFieldProps]> = {
    email: ['邮箱', 'Mail', {}],
    phone: ['电话', 'CellPhone', {}],
    live_name: ['直播间名字', 'Streaming', {}],
    live_intro: ['直播间简介', '', { multiline: true, draggable: false }],
}

const makeUserProfileItems = (user: Partial<{ email, phone, live_name }>) => {
    const makeItem = (value, [label, iconName, props]) => (
        <Card.Item key={label}>
            <TextField borderless label={label} readOnly iconProps={{ iconName }} value={value} {...props} />
        </Card.Item>
    );
    return Object.entries(params)
        .filter(x => user[x[0]])
        .map(([field, value]) => makeItem(user[field], value))
}

const useModifyUser = (user: Partial<{ email, phone, live_name }>) => {
    const makeProps = ([label, iconName]): ITextFieldProps => ({
        label, iconProps: { iconName }
    })
    const makePropsBy = (field) => makeProps(params[field])
    const makeInitValue = (field) => (user && field in user) ? user[field] : ''
    const [EmailInput, email] = utils.useBoundInput({ ...makePropsBy('email'), onGetErrorMessage: utils.emailChecker }, makeInitValue('email'))
    const [PhoneInput, phone] = utils.useBoundInput({ ...makePropsBy('phone'), onGetErrorMessage: utils.phoneChecker }, makeInitValue('phone'))
    const [LiveNameInput, liveName] = utils.useBoundInput(makePropsBy('live_name'), makeInitValue('live_name'))
    const [LiveIntroInput, liveIntro] = utils.useBoundInput({ ...makePropsBy('live_intro'), multiline: true }, makeInitValue('live_intro'))
    const valid = () => (phone == '' || utils.phoneChecker(phone) == '') && utils.emailChecker(email) == ''

    const components = [EmailInput, PhoneInput, LiveNameInput, LiveIntroInput]
        .map((C, n) => <Card.Item key={`user-field-change-${n}`}>
            {C}
        </Card.Item>);
    return {
        components,
        email, phone, liveName, liveIntro, valid
    }
}

const cardTokens: ICardTokens = {
    childrenMargin: 12,
    minWidth: '100%'
}

export default function UserCard({ ...properties }: ICardProps) {
    const [token, setToken] = useState('fetch')
    const [editable, setEditable] = useState(false)
    const [error, setError] = useState(null)
    const getPresence = () => {
        if (token == '') {
            return PersonaPresence.offline
        }
        if (user == models.defaultUser) {
            return PersonaPresence.blocked
        }
        return PersonaPresence.online
    }
    const router = useRouter()
    const { client, setUser, user } = useContext(MinitubeContext)
    const logout = () => {
        client.logout()
        setToken('')
        setUser(models.defaultUser)
        router.push('/login')
    }

    const { components: edit, email, phone, liveName, liveIntro, valid } = useModifyUser(user)
    const [saving, saveManager] = utils.useWork()
    const handleSaveOrEdit = () => setEditable(true)
    const save = async () => {
        const diffUser = { email, phone, live_name: liveName, live_intro: liveIntro }
        if (diffUser.phone != '' && !diffUser.phone.startsWith('+')) {
            diffUser.phone = `+86${diffUser.phone}`
        }
        const save = () => client.updateProfile(diffUser)
        const reply = await utils.startWork(save, saveManager)
        if (Client.isOK(reply)) {
            setEditable(false)
            setUser({ ...user, ...diffUser })
            return
        }
        setError(reply)
    }

    const editingButtons = <Stack horizontal tokens={{ childrenGap: 4 }}>
        <Stack.Item grow key="save">
            <PrimaryButton style={{ width: '100%' }} disabled={saving || !valid()} onClick={save}>{saving ? '保存中' : '保存'}</PrimaryButton>
        </Stack.Item>
        <Stack.Item key="cancel">
            <DefaultButton onClick={() => setEditable(false)} disabled={saving}>放弃</DefaultButton>
        </Stack.Item>
    </Stack>
    return (
        <Card tokens={cardTokens} {...properties}>
            {user ? [
                <Card.Section key="avatar-section">
                    <Card.Item key="me">
                        <UserPersona user={user} presence={getPresence()} size={PersonaSize.size72} />
                    </Card.Item>
                </Card.Section>,
                <Card.Section key="info-section">
                    {error && <Card.Item key="error">
                        <ErrorNotification error={error} onDismiss={() => setError(null)}></ErrorNotification>
                    </Card.Item>}
                    {editable ? edit : makeUserProfileItems(user)}
                    {user != models.defaultUser && <Card.Item key="edit">
                        {editable ?
                            editingButtons :
                            <PrimaryButton
                                styles={{ root: { width: '100%' } }}
                                onClick={handleSaveOrEdit}
                                disabled={(editable && !valid()) || saving}
                            >修改</PrimaryButton>
                        }
                    </Card.Item>}
                </Card.Section>,
                <Card.Item key="logout">
                    <Button styles={{ root: { width: '100%' } }} onClick={logout}>注销</Button>
                </Card.Item>] :
                <Shimmer />
            }
        </Card>
    )
}