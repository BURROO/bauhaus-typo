'use client'

import { TypeProject } from "@/types/project-type"
import styles from './Book.module.css'
import ParametricBook from "./ParametricBook"
import { useState } from "react"
import Slideshow from "../../general/Slideshow"


interface Props {
    item: TypeProject
}

const Book = ({ item }: Props) => {



    const [view, setView] = useState<'cover'|'content'>('cover')


    const index = item.Studierende.length % 2 + 1
    const [showButton, setShowButton] = useState(false)


    return (
        <>
            <div className={styles.book}>
                {view === "cover" && (
                    <ParametricBook
                    type="interact"
                    item={item}
                    setShowButton={setShowButton}
                    />
                )}
                {view === "content" && (
                    <Slideshow
                    isBook={true}
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

export default Book



