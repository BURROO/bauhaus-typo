'use client'

import styles from "./PageWrapper.module.css";

import TranscodingTypography from "@/components/slug/transcodingTypography/TranscodingTypography";
import InOrderOfMeaning from "@/components/slug/inOrderOfMeaning/InOrderOfMeaning";
import PunkZine from "@/components/slug/punkZine/PunkZine";
import Link from "next/link";
import { TypeProject } from "@/types/project-type";
import { useEffect, useState } from "react";

interface Props{
    item: TypeProject;
}

const PageWrapper = ({ item }: Props) => {

    const [isHovered, setIsHovered] = useState(false)

    // console.log("item", item)

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


        // return () => {
        //     clearTimeout(timeout1)
        // }
    }, [])

    return (
        <div className={styles.page}>
            <div
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
            </div>

            <div className={styles.intro} style={introStyle}>
                <div>
                    <h1>{item.Studierende}</h1>
                    <h2>{item.Kurs}</h2>
                </div>
            </div>
            <main className={styles.main}>
                {/* <List data={data} /> */}
                <div className={styles.wrapper} style={{
                    // width: isHovered ? '80vw' : '',
                    // height: isHovered ? '90vh' : '',
                    borderRadius: isHovered ? 5 : 0,
                    transform: introStyle.opacity === 1 || isHovered ? `scale(0.9)` : ''
                }}>
                    {item.Kurs === "Transcoding Typography" && <TranscodingTypography item={item} />}
                    {item.Kurs === "In Order Of Meaning " && <InOrderOfMeaning item={item} />}
                    {item.Kurs === "Punk Zine" && <PunkZine item={item} />}
                </div>
            </main>
        </div>
    )
}


export default PageWrapper