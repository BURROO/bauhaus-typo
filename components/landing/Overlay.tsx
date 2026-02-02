'use client'

import { TypeProject } from '@/types/project-type';
import styles from './Overlay.module.css'
import { getType } from '@/util/sanitizeForUrl';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import { ContextMenu } from '../context/ContextMenu';
import { CameraProps } from '@react-three/fiber';
import SceneCard from './three/cards/SceneCards';

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

    const { activeIndex, rowHeight } = useContext(ContextMenu)

    const [stableIndex, setStableIndex] = useState<number | null>(null)

    useEffect(() => {
        if (activeIndex === null) {
            setStableIndex(null)
            return
        }

        const t = setTimeout(() => {
            setStableIndex(activeIndex)
        }, 80) // 👈 tweak (80–200ms works well)

        return () => clearTimeout(t)
    }, [activeIndex])


    const activeProject =
    stableIndex !== null
        ? dataStudents.find(d => d.index === stableIndex)
        : null

    const type = activeProject && getType(activeProject)

    const orbitCam: CameraProps = {
        position: [0, 2/1.5, 6/1.5],
        near: 0.1,
        far: 10,
        zoom: 17
    }

    return (
        <div 
        className={styles.overlay}
        style={{ 
            height : rowHeight ? rowHeight*25+2 : 0,
            paddingBottom: rowHeight ? rowHeight*3 : 0,
            visibility: activeIndex === null ? 'hidden' : 'visible',
        }}
        >
            <SceneWrapper camSettings={orbitCam} autoRotateSpeed={6} type={"orbit"}>
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
                    <ScenePoster
                    type="orbit"
                    item={activeProject || null}
                    onClick={() => {}}
                    />
                }
                {type === "CARD GAME" && 
                    <SceneCard
                    visible={type === "CARD GAME"}
                    item={activeProject || null}
                    onClick={() => {}}
                    />
                }
            </SceneWrapper>
        </div>
    )
}

export default Overlay


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