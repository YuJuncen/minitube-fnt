import { initializeIcons } from '@fluentui/react/lib-commonjs/Icons';
import { Customizer, Stack, Spinner, DefaultPalette } from '@fluentui/react';
import { FluentCustomizations } from '@uifabric/fluent-theme'
import MinitubeContext from '../lib/global';
import { useState, useEffect } from 'react';
import modles, { User } from '../lib/models';
import Client from '../lib/miniclient';
import HeadTitle from '../components/head-title';
import { useRouter } from 'next/router';
import LoadingLayer from '../components/loading-layer';
import styles from '../lib/styles';

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState<User>(modles.defaultUser)
    const client = Client.global()
    const [isLoading, setLoading] = useState(false)
    const router = useRouter()
    useEffect(() => {
        const startLoading = () => setLoading(true)
        const stopLoading = () => setLoading(false)

        router.events.on('routeChangeStart', startLoading)
        router.events.on('routeChangeComplete', stopLoading)

        return () => {
            router.events.off('routeChangeStart', startLoading)
            router.events.off('routeChangeComplete', stopLoading)
        }
    })
    useEffect(() => {
        client.whoAmI().then(userReply => {
            if (Client.isOK(userReply)) {
                setUser(userReply.user)
                return
            }
            setUser(modles.defaultUser)
        })
    }, [])
    useEffect(() => {
        initializeIcons()
    }, [])
    return <MinitubeContext.Provider value={{ user, setUser, client: Client.global() }}>
        <Customizer {...FluentCustomizations}>
            {isLoading && <Stack style={{ ...styles.overlay, backgroundColor: DefaultPalette.neutralLighter, backdropFilter: 'blur(4px)', zIndex: 1011 }} verticalAlign="center" horizontalAlign="center">
                <Stack.Item key="loading">
                    <Spinner styles={{
                        circle: {
                            borderColor: `${DefaultPalette.blackTranslucent40} ${DefaultPalette.blackTranslucent40} ${DefaultPalette.neutralDark}`,
                            height: '10em',
                            width: '10em',
                            borderWidth: '1em'
                        }
                    }} />
                </Stack.Item>
            </Stack>}
            <HeadTitle></HeadTitle>
            <div style={{ maxWidth: '70%', margin: 'auto' }}>
                <Component {...pageProps} />
            </div>
        </Customizer>
    </MinitubeContext.Provider>
}

export default MyApp