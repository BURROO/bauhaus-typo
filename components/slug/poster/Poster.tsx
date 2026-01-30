'use client'

import { TypeProject } from "@/types/project-type"
import styles from './Poster.module.css'
import { useState } from "react"
import Slideshow from "../../general/Slideshow"
import ScenePosterWrapper from "@/components/landing/three/poster/ScenePoster"
import { CameraProps } from "@react-three/fiber"
import SceneWrapper from "@/components/landing/three/SceneWrapper"
import Button from "@/components/general/Button"


interface Props {
    item: TypeProject
}




const Poster = ({ item }: Props) => {


    const [view, setView] = useState<'poster'|'slideshow'>('poster')

    const [showButton, setShowButton] = useState(true)


    const interactCam: CameraProps = {
        // position: [0.02, 0.4, 0.6], 
        position: [0.02, 0.2*0.7, 0.3*0.7], 
        fov: 45 
    }

    return (
        <>
         
             <div className={styles.poster}>
                {view === "poster" && (
                    <SceneWrapper
                    camSettings={interactCam}
                    type={"interact"}
                    autoRotateSpeed={0}
                    >
                        <ScenePosterWrapper
                        type="interact"
                        item={item}
                        />
                    </SceneWrapper>
                )}
                {view === "slideshow" && (
                    <Slideshow
                    isBook={true}
                    item={item}
                    setShowButton={setShowButton}
                    />
                )}
            </div>
            {
                showButton && 
                // <button 
                // onMouseOver={() => setShowButton(true)}
                // onClick={() => setView(view === "poster" ? "slideshow" : "poster")}
                // className={styles.button}
                // >
                //    Look at {view === "poster" ? "Slideshow" : "Poster"}
                // </button>
                <div className={styles.button}>
                    <Button
                    onClick={() => setView(view === "poster" ? "slideshow" : "poster")}
                    text={`Look at ${view === "poster" ? "Slideshow" : "Poster"}`}
                    />
                </div>
            }
        </>
    )
}

export default Poster



