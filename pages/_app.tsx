import { initializeIcons } from '@fluentui/react/lib-commonjs/Icons';
import { Customizer } from '@fluentui/react';
import { FluentCustomizations } from '@uifabric/fluent-theme'

function MyApp({ Component, pageProps }) {
    initializeIcons()
    return <Customizer {...FluentCustomizations}>
        <Component {...pageProps} />
    </Customizer>
}

export default MyApp