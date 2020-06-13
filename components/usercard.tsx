import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence, Button, Shimmer } from '@fluentui/react'
import { useState, useEffect } from 'react'
import { Card, ICardTokens } from '@uifabric/react-cards'

export default function UserCard({ client, ...properties }) {
    const [token, setToken] = useState('fetch')
    const getPresence = () => {
        if (token == '') {
            return PersonaPresence.offline
        }
        return PersonaPresence.online
    }
    const logout = () => {
        client.logout()
        setToken('')
    }
    useEffect(() => {
        client.getOrRefreshToken().then(token => setToken(token))
    })

    const mine: IPersonaSharedProps = {
        text: "Eva Lu Ator",
        secondaryText: "解释器",
    }

    const cardTokens : ICardTokens = {
        childrenMargin: 12,
        minWidth: '100%'
    }


    return (
        <Card tokens={cardTokens} {...properties}>
            {   token !== 'fetch' ? [
                <Card.Item key="me">
                    <Persona presence={getPresence()} {...mine} size={PersonaSize.size72} />
                </Card.Item>,
                <Card.Item key="logout">
                    <Button styles={{root: {width: '100%'}}} onClick={logout}>注销</Button>
                </Card.Item>] :
                <Shimmer />
            }
        </Card>
    )    
}