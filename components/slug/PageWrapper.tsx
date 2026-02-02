'use client'

import styles from "./PageWrapper.module.css";

// import TranscodingTypography from "@/components/slug/transcodingTypography/TranscodingTypography";
// import InOrderOfMeaning from "@/components/slug/inOrderOfMeaning/InOrderOfMeaning";
// import PunkZine from "@/components/slug/punkZine/PunkZine";
import Link from "next/link";
import { TypeProject } from "@/types/project-type";
import { ReactNode, useContext, useEffect, useState } from "react";
// import TypeLarge from "../layer2/TypeLarge";
import ProjectInfo from "./ProjectInfo";
import dynamic from 'next/dynamic'
import { getType } from "@/util/sanitizeForUrl";
import { useRouter } from "next/navigation";
import { ContextMenu } from "../context/ContextMenu";
import { xor } from "lodash";
import Button from "../general/Button";
import { getAssetWebsite } from "@/util/getAssets";

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

// const PunkZine = dynamic(
//   () => import("@/components/slug/__punkZine/PunkZine"),
//   { ssr: false }
// );

interface Props{
    item: TypeProject;
}

const PageWrapper = ({ item }: Props) => {


    const { isHovered, view } = useContext(ContextMenu)
    const router = useRouter()


    useEffect(() => {

        const handleEscape = (e: any) => {

            if(e.key === "Escape") {
                router.push('/')
            }
        }

        window.addEventListener("keydown", handleEscape)


        return () => {
            window.removeEventListener("keydown", handleEscape)
        }
    }, [])


    const [mousePos, setMousePos ] = useState<null|{x: number; y: number }>(null)


    useEffect(() => {

        const handleMousePos = (e: any) => {

            const { clientX: x, clientY: y} = e
            
            setMousePos({ x, y })
        }

        if(isHovered){
            window.addEventListener("mousemove", handleMousePos)
        }else{
            setMousePos(null)
            window.removeEventListener("mousemove", handleMousePos)
        }

        return () => {

            setMousePos(null)
            window.removeEventListener("mousemove", handleMousePos)
        }

    }, [isHovered])

    const type = getType(item)

    const buttonText = type === 'WEBSITE' ? 'Open Website' : 'Open Slideshow'


    const hasWebsite =  type === 'WEBSITE' && !getAssetWebsite({ item }) ? false : true

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.wrapper} style={{
                    borderRadius: isHovered ? 5 : 0,
                }}>
                 
                    {type === "POSTER" && <Poster item={item} />}
                    {type === "WEBSITE" && <Website item={item} />}
                    {type === "PUBLICATION" && <Book item={item} />}
            
                </div>
            </main>
            <ProjectInfo project={item} />

            {
                hasWebsite &&
                mousePos && 
                view === 'outside' &&
                <div style={{ position: 'fixed', left: mousePos?.x+ 20, top: mousePos.y - 20, pointerEvents: "none"}}>
                    <Button text={buttonText} onClick={() => {
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
