'use client'

import { TypeProject } from "@/types/project-type"
import styles from './Book.module.css'
import SceneBook from "../../landing/three/book/SceneBook"
import { useState } from "react"
import Slideshow from "../../general/Slideshow"
import SceneWrapper from "@/components/landing/three/SceneWrapper"
import { CameraProps } from "@react-three/fiber"


interface Props {
    item: TypeProject
}

const Book = ({ item }: Props) => {

    const [view, setView] = useState<'cover'|'content'>('cover')

    // const index = item.NAME.length % 2 + 1
    const [showButton, setShowButton] = useState(false)

    const interactCam: CameraProps = {
        position: [0.02, 0.4, 0.6], 
        fov: 45 
    }

    return (
        <>
            <div className={styles.book}>
                {view === "cover" && (
                    <SceneWrapper
                    camSettings={interactCam}
                    type={"interact"}
                    autoRotateSpeed={0}
                    >
                        <SceneBook
                        type="interact"
                        item={item}
                        setShowButton={setShowButton}
                        />
                    </SceneWrapper>
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



