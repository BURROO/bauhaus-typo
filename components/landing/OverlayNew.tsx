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