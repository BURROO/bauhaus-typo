'use client'

import { TypeProject } from "@/types/project-type"
import styles from './Book.module.css'
import SceneBook from "../../landing/three/book/SceneBook"
import { useContext, useState } from "react"
import Slideshow from "../../general/Slideshow"
import SceneWrapper from "@/components/landing/three/SceneWrapper"
import { CameraProps } from "@react-three/fiber"
import Button from "@/components/general/Button"
import { ButtonWrapper } from "../PageWrapper"
import { ContextMenu } from "@/components/context/ContextMenu"


interface Props {
    item: TypeProject;
    // onClick: () => void;
}

const Book = ({ item }: Props) => {

    // const [view, setView] = useState<'cover'|'content'>('cover')
    const { view, setView } = useContext(ContextMenu)

    // const index = item.NAME.length % 2 + 1
    // const [showButton, setShowButton] = useState(false)

    const interactCam: CameraProps = {
        // position: [0.02, 0.4, 0.6], 
        position: [0.02, 0.2, 0.3], 
        fov: 45 
    }

    return (
        <>
            <div className={styles.book}>
                {view === "outside" && (
                    <SceneWrapper
                    camSettings={interactCam}
                    type={"interact"}
                    autoRotateSpeed={0}
                    >
                        <SceneBook
                        visible={true}
                        item={item}
                        onClick={() => setView(view === 'outside' ? 'inside' : 'outside')}
                        />
                    </SceneWrapper>
                )}
                {view === "inside" && (
                    <Slideshow
                    isBook={true}
                    item={item}
                    />
                )}
            </div>
                    
            
            <ButtonWrapper>
                <Button
                onClick={() => setView(view === "inside" ? "outside" : "inside")}
                text={`Look ${view === "inside" ? "outside" : "inside"}`}
                />
            </ButtonWrapper>
        </>
    )
}

export default Book



