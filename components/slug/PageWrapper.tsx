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

    console.log("item", item)

    return (
        <div className={styles.page}>
       

            <main className={styles.main}>
                <div className={styles.wrapper} style={{
                    // width: isHovered ? '80vw' : '',
                    // height: isHovered ? '90vh' : '',
                    borderRadius: isHovered ? 5 : 0,
                }}>
                    {/* Special */}
                    {item.Kurs === "Bauhaus Master Lectures" && <Poster item={item} />}
                    {item.Title === "204 Type-Gazette Issue 06" && <Book item={item} />}


                    {item.Kurs === "First Year Introduction" && <Poster item={item} />}
                    {item.Kurs === "Independent Project" && <Poster item={item} />}
                    {/* Generic from courses!! */}
                    {item.Type === "WWW" && <Website item={item} />}
                    {item.Type === "BOOK" && <Book item={item} />}
                </div>
            </main>

            {/* <div 
            className={styles.intro} 
            style={introStyle}
            >
                <TypeLarge text={`${item.Studierende}\\${item.Title}`} />
            </div> */}
            
            <ProjectInfo project={item} />
        </div>
    )
}


export default PageWrapper


/* <div
className={styles.overlay}
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
style={{
    width: isHovered ? 'auto' : '30px',
    height: isHovered ? '100px' : '30px',
    overflow: "hidden",
    borderRadius: isHovered ? 5 : 20

}}
>
    <div style={{ opacity: isHovered ? 1 : 0}}>
        <h1>{item.Studierende}</h1>
        <h2>{item.Kurs}</h2>
        <br/>
        <Link href={`/`}>← Go Back</Link>
    </div>
</div> */