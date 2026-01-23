'use client'

import { TypeProject } from "@/types/project-type"
import styles from './InOrderOfMeaning.module.css'
import ParametricBook from "./ParametricBook"
import { useState } from "react"
import BookContent from "./BookContent"


interface Props {
    item: TypeProject
}

const InOrderOfMeaning = ({ item }: Props) => {



    const [view, setView] = useState<'cover'|'content'>('cover')


    const index = item.Studierende.length % 2 + 1



    return (
        <>
            <div className={styles.inOrderOfMeaning}>
                {view === "cover" && <ParametricBook type="interact" item={item} onClick={() => setView('content')}/>}
                {view === "content" && <BookContent item={item} onClick={() => setView('cover')}/>}
            </div>
        </>
    )
}

export default InOrderOfMeaning



