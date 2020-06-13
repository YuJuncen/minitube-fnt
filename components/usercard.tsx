import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence, Button, Shimmer } from '@fluentui/react'
import { useState, useEffect } from 'react'
import { Card, ICardTokens, ICardProps } from '@uifabric/react-cards'
import { useRouter } from 'next/router'
import Client from '../lib/miniclient'
import codes from '../lib/codes'

export default function UserCard({ client, ...properties } : {client: Client} & ICardProps) {
    const [token, setToken] = useState('fetch')
    const [user, setUser] = useState<{username: string}>(null)
    const getPresence = () => {
        if (token == '') {
            return PersonaPresence.offline
        }
        return PersonaPresence.online
    }
    const router = useRouter()
    const logout = () => {
        client.logout()
        setToken('')
        router.push('/login')
    }
    useEffect(() => {
        client.getOrRefreshToken().then(token => setToken(token))
        client.whoAmI().then(user => {
            if (user.code == codes.OK) {
                setUser(user.user)
                return
            }
            router.push('/login')
        })
    }, [])

    const mine = () => ({
        text: user.username,
        secondaryText: "Yantube 的粉丝",
    })

    const cardTokens : ICardTokens = {
        childrenMargin: 12,
        minWidth: '100%'
    }


    return (
        <Card tokens={cardTokens} {...properties}>
            {   user ? [
                <Card.Item key="me">
                    <Persona presence={getPresence()} {...mine()} size={PersonaSize.size72} />
                </Card.Item>,
                <Card.Item key="logout">
                    <Button styles={{root: {width: '100%'}}} onClick={logout}>注销</Button>
                </Card.Item>] :
                <Shimmer />
            }
        </Card>
    )    
}