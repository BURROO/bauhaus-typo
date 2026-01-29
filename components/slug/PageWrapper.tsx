'use client'

import styles from "./PageWrapper.module.css";

// import TranscodingTypography from "@/components/slug/transcodingTypography/TranscodingTypography";
// import InOrderOfMeaning from "@/components/slug/inOrderOfMeaning/InOrderOfMeaning";
// import PunkZine from "@/components/slug/punkZine/PunkZine";
import Link from "next/link";
import { TypeProject } from "@/types/project-type";
import { useEffect, useState } from "react";
// import TypeLarge from "../layer2/TypeLarge";
import ProjectInfo from "./ProjectInfo";
import dynamic from 'next/dynamic'
import { getType } from "@/util/sanitizeForUrl";

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

    const [isHovered, setIsHovered] = useState(false)


    const [introStyle, setIntroStyle] = useState({
        opacity: 1,
        display: "flex"
    })

    useEffect(() => {

        const timeout1 = setTimeout(() => {

            setIntroStyle({
                opacity: 0,
                display: "flex"
            })
        }, 1000)


        return () => {
            clearTimeout(timeout1)
        }
    }, [])


    const type = getType(item)

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
        </div>
    )
}


export default PageWrapper
