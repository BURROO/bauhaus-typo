'use client'

import { TypeProject } from '@/types/project-type';
import styles from './Overlay.module.css'
import { getType, sanitizeForUrl } from '@/util/sanitizeForUrl';
import { fileDataTT } from '@/data/fileData';
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { ContextMenu } from '../context/ContextMenu';
// import SceneWrapper from './three/SceneWrapper';
import { CameraProps } from '@react-three/fiber';

const SceneWrapper = dynamic(
  () => import("@/components/landing//three/SceneWrapper"),
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

const Overlay = ({ 
    dataStudents, 
    autoRotateSpeed 
}: {
    dataStudents: TypeProject[]; 
    autoRotateSpeed: number 
}) => {

    const { activeIndex } = useContext(ContextMenu)

    const activeProject = activeIndex !== null && dataStudents.find(d => d.index === activeIndex) || null


    const type = activeProject && getType(activeProject)

    const orbitCam: CameraProps = {
    //   position: [0, 0.4, 0.6],
    position: [0, 2/1.5, 6/1.5],
    // position: [0, 2, 6],
    near: 0.1,
    far: 10,
    zoom: 17
    }

    return (
        <div 
        className={styles.overlay}
        >
            <SceneWrapper camSettings={orbitCam} autoRotateSpeed={6} type={"orbit"}>
                {activeProject && <>
                    {/* {type === "SLIDESHOW" && <OverlayImage item={activeProject} autoRotateSpeed={autoRotateSpeed}/>} */}
                    {type === "POSTER" && <OverlayPoster item={activeProject} autoRotateSpeed={autoRotateSpeed}/>}
                    {type === "WEBSITE" && <OverlayMac item={activeProject} autoRotateSpeed={autoRotateSpeed}/>}
                    {type === "PUBLICATION" && <OverlayBook item={activeProject} autoRotateSpeed={autoRotateSpeed}/>}
                </>}
            </SceneWrapper>
        </div>
    )
}

export default Overlay


const OverlayMac = ({ item, autoRotateSpeed }: { item: TypeProject, autoRotateSpeed: number; }) => {
    // Handle

    return (
    
        <SceneMacbook type="orbit" item={item} isDouble={true}/>
    )
}


const OverlayBook = ({ item, autoRotateSpeed }: { item: TypeProject; autoRotateSpeed: number; }) => {
    // Handle

    return (
        <SceneBook item={item} setShowButton={() => {}} />
    )
}

const OverlayPoster = ({ item, autoRotateSpeed }: { item: TypeProject; autoRotateSpeed: number; }) => {
    // Handle

    return (
        <ScenePoster
        type="orbit"
        item={item}
        rolled={true}
        />
    )
}



const OverlayImage = ({ item, autoRotateSpeed }: { item: TypeProject; autoRotateSpeed: number; }) => {
    // Handle

    const url = sanitizeForUrl(item["NAME"])


    // const hasVideo = Boolean(src) && src.endsWith('.webm')
    // @ts-ignore
    const src = fileDataTT[url] || null

    return (
        <div style={{ height: 400 }}>
            <img src={src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
    )
}
