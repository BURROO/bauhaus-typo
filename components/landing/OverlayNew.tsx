'use client'

import { TypeProject } from '@/types/project-type';
import styles from './Overlay.module.css'
import { getProjectTitle} from '@/util/sanitizeForUrl';
import { useContext, useEffect, useState } from 'react';
import { ContextMenu } from '../context/ContextMenu';



const OverlayNew = ({ 
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

    

    const title = activeProject && getProjectTitle(activeProject)

    console.log(title)


    return (
        <div 
        className={styles.overlay}
        style={{ 
            height : rowHeight ? rowHeight*25+2 : 0,
            paddingBottom: rowHeight ? rowHeight*3 : 0,
            visibility: activeIndex === null ? 'hidden' : 'visible',
        }}
        >
            {title && <video src={`preview/${title}.webm`} autoPlay muted loop/>}
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