'use client'

import { ReactNode } from "react";
import { ContextMenuProvider } from "./context/ContextMenu"

interface Props {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {

    return (
        <ContextMenuProvider>
            {children}
        </ContextMenuProvider>
    )
}

export default Layout