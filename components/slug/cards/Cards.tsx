'use client'

import { TypeProject } from "@/types/project-type"
import styles from './Cards.module.css'
import SceneBook from "../../landing/three/book/SceneBook"
import { useContext, useState } from "react"
import Slideshow from "../../general/Slideshow"
import SceneWrapper from "@/components/landing/three/SceneWrapper"
import { CameraProps } from "@react-three/fiber"
import Button from "@/components/general/Button"
import { ButtonWrapper } from "../PageWrapper"
import { ContextMenu } from "@/components/context/ContextMenu"
import SceneCard from "@/components/landing/three/cards/SceneCards"


interface Props {
    item: TypeProject;
    // onClick: () => void;
}

const Cards = ({ item }: Props) => {

    const { view, setView } = useContext(ContextMenu)

    const interactCam: CameraProps = {
        // position: [0.02, 0.4, 0.6], 
        // position: [0.02, 0.2, 0.3], 
        position: [0.02, 0.4, 0.6], 
        fov: 45 
    }

    return (
        <>
            <div className={styles.cards}>
                {view === "outside" && (
                    <SceneWrapper
                    camSettings={interactCam}
                    type={"interact"}
                    autoRotateSpeed={0}
                    >
                        <SceneCard
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
                    
            
            {view === "inside" && <ButtonWrapper>
                <Button
                onClick={() => setView(view === "inside" ? "outside" : "inside")}
                text={`Look ${view === "inside" ? "outside" : "inside"}`}
                />
            </ButtonWrapper>}
        </>
    )
}

export default Cards



