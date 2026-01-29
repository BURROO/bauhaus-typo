'use client'

import { ReactNode, useState } from "react";
import { ContextMenuProvider } from "./context/ContextMenu"
import Preloader from "./loading/Loader";


interface Props {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {

    const [isPreloaded, setIsPreloaded] = useState(false)

    if(!isPreloaded) return <Preloader onDone={() => setIsPreloaded(true)}/>

    return (
        <ContextMenuProvider>
            {children}
        </ContextMenuProvider>
    )
}

export default Layout