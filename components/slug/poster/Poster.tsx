'use client'

import { TypeProject } from "@/types/project-type"
import styles from './Poster.module.css'
import { useContext, useState } from "react"
import Slideshow from "../../general/Slideshow"
import ScenePosterWrapper from "@/components/landing/three/poster/ScenePoster"
import { CameraProps } from "@react-three/fiber"
import SceneWrapper from "@/components/landing/three/SceneWrapper"
import Button from "@/components/general/Button"
import { ButtonWrapper } from "../PageWrapper"
import { ContextMenu } from "@/components/context/ContextMenu"


interface Props {
    item: TypeProject
}

const Poster = ({ item }: Props) => {

    const { view, setView } = useContext(ContextMenu)

    const interactCam: CameraProps = {
        // position: [0.02, 0.4, 0.6], 
        position: [0.02, 0.2*0.2, 0.3*1], 
        fov: 45 
    }

    return (
        <>
            <div className={styles.poster}>
                {view === "outside" && (
                    <SceneWrapper
                    camSettings={interactCam}
                    type={"interact"}
                    autoRotateSpeed={0}
                    >
                        <ScenePosterWrapper
                        onClick={() => setView('inside')}
                        type="interact"
                        item={item}
                        />
                    </SceneWrapper>
                )}
                {view === "inside" && (
                    <Slideshow
                    isBook={false}
                    item={item}
                    // setShowButton={setShowButton}
                    />
                )}
            </div>
            {view === "inside" && <ButtonWrapper>
                <Button
                // onClick={() => setView(view === "outside" ? "inside" : "outside")}
                // text={`Look at ${view === "outside" ? "Slideshow" : "Poster"}`}
                onClick={() => setView("inside")}
                text={`Look at Slideshow`}
                />
            </ButtonWrapper>}
        </>
    )
}

export default Poster



