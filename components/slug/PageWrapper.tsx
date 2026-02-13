'use client'

import styles from "./PageWrapper.module.css";

// import TranscodingTypography from "@/components/slug/transcodingTypography/TranscodingTypography";
// import InOrderOfMeaning from "@/components/slug/inOrderOfMeaning/InOrderOfMeaning";
// import PunkZine from "@/components/slug/punkZine/PunkZine";
import Link from "next/link";
import { TypeProject } from "@/types/project-type";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
// import TypeLarge from "../layer2/TypeLarge";
import ProjectInfo from "./ProjectInfo";
import dynamic from 'next/dynamic'
import { getType } from "@/util/sanitizeForUrl";
import { useRouter } from "next/navigation";
import { ContextMenu } from "../context/ContextMenu";
import Button from "../general/Button";
import { getAssetWebsite } from "@/util/getAssets";
import { useMousePos } from "../hook/useMousePos";
import BackgroundSVG from "../landing/svg/BackgroundSVG";
// import Cards from "./cards/Cards";

const Book = dynamic(
  () => import("@/components/slug/book/Book"),
  { ssr: false }
);

const Poster = dynamic(
  () => import("@/components/slug/poster/Poster"),
  { ssr: false }
);

const Website = dynamic(
  () => import("@/components/slug/website/Website"),
  { ssr: false }
);

const Cards = dynamic(
  () => import("@/components/slug/cards/Cards"),
  { ssr: false }
);

interface Props{
    item: TypeProject;
}

const PageWrapper = ({ item }: Props) => {


    const { isHovered, view, setView } = useContext(ContextMenu)
    const router = useRouter()


    useEffect(() => {

        const handleEscape = (e: any) => {

            if(e.key === "Escape") {
                if(view === 'inside'){
                    setView("outside")
                }else{
                    router.push('/')
                }
            }
        }

        window.addEventListener("keydown", handleEscape)


        return () => {
            window.removeEventListener("keydown", handleEscape)
        }
    }, [view])

    // const { mousePos } = useMousePos({}, isHovered)
    const { mousePos } = useMousePos({}, true)


    const type = getType(item)

    const buttonText = type === 'WEBSITE' ? 
       ( isHovered ? 'Open Website' : 'Click & Drag') : 
       ( isHovered ? 'Open Slideshow' : 'Click & Drag')


    const hasWebsite =  useMemo(() => (type === 'WEBSITE' && !getAssetWebsite({ item })) ? false : true,[item])



    return (
        <div className={styles.page}>
            <div style={{ position: "absolute", left: 0, top: 0,  zIndex: 0, width: `100%`, height: `100%`}}>
                <BackgroundSVG />
            </div>
            <main className={styles.main}>
                <div className={styles.wrapper} style={{
                    borderRadius: isHovered ? 5 : 0,
                }}>
                 
                    {type === "POSTER" && <Poster item={item} />}
                    {type === "WEBSITE" && <Website item={item} />}
                    {type === "PUBLICATION" && <Book item={item} />}
                    {type === "CARD GAME" && <Cards item={item} />}
            
                </div>
            </main>
            <ProjectInfo project={item} />
                {/* <div style={{ position: "fixed", background: "red"}} >{mousePos?.x}</div> */}
            {
                hasWebsite &&
                mousePos && 
                view === 'outside' &&
                <div style={{ 
                    position: 'fixed',
                    left: mousePos?.x+ 20, 
                    top: mousePos.y - 20, 
                    pointerEvents: "none", 
                    zIndex: 2
                }} key={view}>
                    <Button 
                    text={buttonText} 
                    onClick={() => {
                        // 
                    }}/>
                </div>
            }
        </div>
    )
}





export const ButtonWrapper = ({ children } : { children: ReactNode }) => {


    return (
        <div className={styles.footer}>
            {children}
        </div>
    )
}


export default PageWrapper
