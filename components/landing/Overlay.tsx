import { TypeProject } from '@/types/project-type';
import styles from './Overlay.module.css'
import ParametricBook from '../slug/book/ParametricBook';
import Scene from './three/Scene';
import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';


// const Scene = dynamic(
//   () => import("./three/Scene"),
//   { ssr: false }
// );


const Overlay = ({ item, autoRotateSpeed }: {item: TypeProject; autoRotateSpeed: number }) => {



    const [currentRotation, setCurrentRotation] = useState(0)

    useEffect(() => {

        const timeout = setTimeout(() => {
            setCurrentRotation(currentRotation+1)
        }, 10)


        return () => {
            clearTimeout(timeout)
        }

    }, [])


    if(typeof item === "undefined") return <></>

    return (
            <div 
            className={styles.overlay}
            >
                {item["Type"] === "WWW" && <OverlayTranscoding item={item} autoRotateSpeed={autoRotateSpeed}/>}
                {item["Kurs"] === "In Order Of Meaning" && <OverlayOrderOfMeaning item={item} autoRotateSpeed={autoRotateSpeed}/>}
            </div>
    )
}

export default Overlay


const OverlayTranscoding = ({ item, autoRotateSpeed }: { item: TypeProject, autoRotateSpeed: number; }) => {
    // Handle



    return (
        <div 
        className={styles.overlay}
        >
            <Scene item={item} rotationSpeed={6}/>
        </div>
    )
}


const OverlayOrderOfMeaning = ({ item, autoRotateSpeed }: { item: TypeProject; autoRotateSpeed: number; }) => {
    // Handle

    return (
        <div style={{ height: 400 }}>
            <ParametricBook type="orbit" item={item} setShowButton={() => {}} autoRotateSpeed={autoRotateSpeed}/>
        </div>
    )
}