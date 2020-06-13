import { initializeIcons } from '@fluentui/react/lib-commonjs/Icons';

function MyApp({ Component, pageProps }) {
    initializeIcons()
    return <Component {...pageProps} />
}

export default MyApp