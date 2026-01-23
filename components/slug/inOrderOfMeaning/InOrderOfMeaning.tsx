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
    const [showButton, setShowButton] = useState(false)


    return (
        <>
            <div className={styles.inOrderOfMeaning}>
                {view === "cover" && (
                    <ParametricBook
                    type="interact"
                    item={item}
                    setShowButton={setShowButton}
                    />
                )}
                {view === "content" && (
                    <BookContent
                    item={item}
                    setShowButton={setShowButton}
                    />
                )}
            </div>
            {
                showButton && 
                <button 
                onMouseOver={() => setShowButton(true)}
                onClick={() => setView(view === "content" ? "cover" : "content")}
                className={styles.button}
                >
                   Look {view === "content" ? "outside" : "inside"}
                </button>
            }
        </>
    )
}

export default InOrderOfMeaning



