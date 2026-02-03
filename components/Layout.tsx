'use client'

import { ReactNode, useState } from "react";
import { ContextMenuProvider } from "./context/ContextMenu"
import Preloader from "./loading/Loader";
import Head from "next/head";


interface Props {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {

    const [isPreloaded, setIsPreloaded] = useState(false)

    if(!isPreloaded) return <Preloader onDone={() => setIsPreloaded(true)}/>

    return (
        <>
            <Head>
                <link
                rel="preload"
                href="/fonts/UfficioMono-Normal.woff2"
                as="font"
                type="font/woff2"
                crossOrigin={undefined}
                />
                <link
                rel="preload"
                href="/fonts/UfficioMono-Bold.woff2"
                as="font"
                type="font/woff2"
                crossOrigin={undefined}
                />
            </Head>
            <ContextMenuProvider>
                {children}
            </ContextMenuProvider>
        </>
    )
}

export default Layout