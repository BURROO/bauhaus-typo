'use client'

import { TypeProject } from '@/types/project-type';
import styles from './Overlay.module.css'
import { getProjectTitle} from '@/util/sanitizeForUrl';
import { useContext, useEffect, useRef, useState } from 'react';
import { ContextMenu } from '../context/ContextMenu';


const GLOBAL_START = performance.now()
const GLOBAL_LOOP_MS = 4000

const OverlayNew = ({ 
    dataStudents, 
    autoRotateSpeed 
}: {
    dataStudents: TypeProject[]; 
    autoRotateSpeed: number 
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const { activeIndex, rowHeight } = useContext(ContextMenu)

    const activeProject =
    activeIndex !== null
        ? dataStudents.find(d => d.index === activeIndex)
        : null

    

    const title = activeProject && getProjectTitle(activeProject)

    // console.log(title)
    // useEffect(() => {
    //     const video = videoRef.current
    //     if (!video) return

    //     let frame: number
    //     const cycleMs = 4000
    //     const startTime = performance.now()

    //     let lastTime = -1


    //     const animate = (now: number) => {
    //         if (!video.duration) {
    //             frame = requestAnimationFrame(animate)
    //             return
    //         }

    //         const elapsed = now - startTime
    //         const progress = (elapsed % cycleMs) / cycleMs
    //         const targetTime = video.duration * progress

    //         // Only seek if difference is noticeable
    //         if (Math.abs(targetTime - lastTime) > 0.04) { 
    //             video.currentTime = targetTime
    //             lastTime = targetTime
    //         }

    //         frame = requestAnimationFrame(animate)

    //         console.log(frame)
    //     }

    //     const handleLoaded = () => {
    //         video.pause()
    //         frame = requestAnimationFrame(animate)
    //     }

    //     if (video.readyState >= 1) {
    //         handleLoaded()
    //     } else {
    //         video.addEventListener('loadedmetadata', handleLoaded)
    //     }

    //     return () => {
    //         video.removeEventListener('loadedmetadata', handleLoaded)
    //         cancelAnimationFrame(frame)
    //     }
    // }, [])


    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoaded = () => {
            const now = performance.now()
            const progress = ((now - GLOBAL_START) % GLOBAL_LOOP_MS) / GLOBAL_LOOP_MS

            video.currentTime = video.duration * progress
            video.play().catch(() => {})
        }

        if (video.readyState >= 1) {
            handleLoaded()
        } else {
            video.addEventListener('loadedmetadata', handleLoaded)
        }

        return () => {
            video.removeEventListener('loadedmetadata', handleLoaded)
        }
    }, [title])


    return (
        <div 
        className={styles.overlay}
        style={{ 
            height : rowHeight ? rowHeight*25+2 : 0,
            paddingBottom: rowHeight ? rowHeight*3 : 0,
            visibility: activeIndex === null ? 'hidden' : 'visible',
        }}
        >
            {title && <video 
            ref={videoRef} 
            src={`preview/${title}.webm`} 
            // autoPlay 
            loop
            muted 
            playsInline
            />}
        </div>
    )
}

export default OverlayNew


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