'use client'

import { TypeProject } from '@/types/project-type';
import styles from './Video.module.css'
import { getType } from '@/util/sanitizeForUrl';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import { ContextMenu } from '../context/ContextMenu';
import { CameraProps } from '@react-three/fiber';
import SceneCard from '../landing/three/cards/SceneCards';
import { clone } from 'lodash';

const SceneWrapperRecord = dynamic(
  () => import("@/components/landing/three/SceneWrapperRecord"),
  { ssr: false }
);

const SceneBook = dynamic(
  () => import("@/components/landing/three/book/SceneBook"),
  { ssr: false }
);

const ScenePoster = dynamic(
  () => import("@/components/landing/three/poster/ScenePoster"),
  { ssr: false }
);

const SceneMacbook = dynamic(
  () => import("@/components/landing/three/macbook/SceneMacbook"),
  { ssr: false }
);

const Video = ({ 
    dataStudents, 
    // autoRotateSpeed 
}: {
    dataStudents: TypeProject[]; 
    // autoRotateSpeed: number 
}) => {

    const { activeIndex, setActiveIndex, rowHeight } = useContext(ContextMenu)

    // ffmpeg -framerate 24 -i frame_%04d.png -c:v libx264 out.mp4


    // const activeProject = dataStudents.find(d => d.index === activeIndex)
    const activeProject = dataStudents.find((d, i) => i === activeIndex) || null

    const type = activeProject && getType(activeProject)

    const orbitCam: CameraProps = {
        position: [0, 2/1.5, 6/1.5],
        near: 0.1,
        far: 10,
        zoom: 17
    }



    const [isExporting, setIsExporting] = useState(false)


    return (
        <div 
        className={styles.video}
        style={{ 
            height : rowHeight ? rowHeight*25+2 : 0,
            paddingBottom: rowHeight ? rowHeight*3 : 0,
        }}
        >
            <div style={{ position: "fixed", zIndex: 1}}>
            <div>
                <button 
                onClick={() => setIsExporting(!isExporting)}
                >
                    {isExporting ? "Stop Exporting" : "Start Exporting"}
                </button>
            </div>
            {
                dataStudents.map((student, i) => (
                    <button 
                    style={{ background: activeIndex === i ? "cyan" : ""}}
                    key={i} onClick={() => {
                        
                        setActiveIndex(i)
                        // 
                    }}>{student.index} {student.NAME}</button>
                ))
            }
            </div>
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}>
                {isExporting && <SceneWrapperRecord
                exportFrames={activeIndex}
                camSettings={orbitCam}
                currentProject={activeProject}
                goNext={ () => {



                    const prevIndex = clone(activeIndex || 0)


                    setActiveIndex(null)


                    setTimeout(() => {
                        setActiveIndex((prevIndex||0)+1)
                    }, 400)
                    
                    // setActiveIndex((activeIndex||0)+1)
                }}
                // autoRotateSpeed={6}
                type={"orbit"}>
                    {type === "PUBLICATION" && 
                        <SceneBook
                        visible={type === "PUBLICATION"}
                        item={activeProject || null}
                        />
                    }
                    {type === "WEBSITE" && 
                    <SceneMacbook
                        visible={type === "WEBSITE"}
                        type="orbit"
                        item={activeProject || null}
                        isDouble={true}
                        onClick={() => {}}
                        />
                    }
                    {type === "POSTER" && 
                    <group scale={1.5}>
                        <ScenePoster
                        type="orbit"
                        item={activeProject || null}
                        onClick={() => {}}
                        /></group>
                    }
                    {type === "CARD GAME" && 
                        <SceneCard
                        visible={type === "CARD GAME"}
                        item={activeProject || null}
                        onClick={() => {}}
                        />
                    }
                </SceneWrapperRecord>}
            </div>
        </div>
    )
}

export default Video


// const OverlayPoster = ({ item, autoRotateSpeed }: { item: TypeProject; autoRotateSpeed: number; }) => {
//     // Handle

//     return (
//         <ScenePoster
//         type="orbit"
//         item={item}
//         rolled={true}
//         />
//     )
// }