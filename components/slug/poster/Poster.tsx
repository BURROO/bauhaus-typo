'use client'

import { TypeProject } from "@/types/project-type"
import styles from './Poster.module.css'
import { useState } from "react"
import Slideshow from "../../general/Slideshow"


interface Props {
    item: TypeProject
}




const Poster = ({ item }: Props) => {



    const [view, setView] = useState<'cover'|'content'>('cover')


    const index = item.NAME.length % 2 + 1
    const [showButton, setShowButton] = useState(false)


    return (
        <>
            <div className={styles.poster}>
                 <Slideshow
                item={item}
                setShowButton={setShowButton}
                isBook={false}
                />
            </div>
            {/* {
                showButton && 
                <button 
                onMouseOver={() => setShowButton(true)}
                onClick={() => setView(view === "content" ? "cover" : "content")}
                className={styles.button}
                >
                   Look {view === "content" ? "outside" : "inside"}
                </button>
            } */}
        </>
    )
}

export default Poster



