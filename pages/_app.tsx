import { initializeIcons } from '@fluentui/react/lib-commonjs/Icons';
import { Customizer } from '@fluentui/react';
import { FluentCustomizations } from '@uifabric/fluent-theme'
import MinitubeContext from '../lib/global';
import { useState, useEffect } from 'react';
import modles, { User } from '../lib/models';
import Client from '../lib/miniclient';
import HeadTitle from '../components/head-title';

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState<User>(modles.defaultUser)
    const client = Client.global()
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
            <HeadTitle></HeadTitle>
            <div style={{maxWidth: '70%', margin: 'auto'}}>
                <Component {...pageProps} />
            </div>
        </Customizer>
    </MinitubeContext.Provider>
}

export default MyApp