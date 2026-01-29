import { TypeProject } from '@/types/project-type';
import styles from './Overlay.module.css'
// import ParametricBook from '../slug/book/ParametricBook';
// import Scene from './three/Scene';
import { useEffect, useState } from 'react';
import { getType, sanitizeForUrl } from '@/util/sanitizeForUrl';
import { fileDataTT } from '@/data/fileData';
import dynamic from 'next/dynamic';

const ParametricBook = dynamic(
  () => import("@/components/slug/book/ParametricBook"),
  { ssr: false }
);

const Scene = dynamic(
  () => import("@/components/landing/three/Scene"),
  { ssr: false }
);

// const Website = dynamic(
//   () => import("@/components/slug/website/Website"),
//   { ssr: false }
// );

const Overlay = ({ item, autoRotateSpeed }: {item: TypeProject; autoRotateSpeed: number }) => {


    // const [currentRotation, setCurrentRotation] = useState(0)

    // useEffect(() => {

    //     const timeout = setTimeout(() => {
    //         setCurrentRotation(currentRotation+1)
    //     }, 10)


    //     return () => {
    //         clearTimeout(timeout)
    //     }

    // }, [])

    if(typeof item === "undefined") return <></>

    const { isOnScreen, isPublication, isSlideshow } = getType(item)

    // console.log(isOnScreen, isPublication, isSlideshow)

    return (
        <div 
        className={styles.overlay}
        >
            {isSlideshow && <OverlayImage item={item} autoRotateSpeed={autoRotateSpeed}/>}
            {/* <h2 style={{ color: "white"}}>{item.NAME} {item.index}</h2> */}
            {isOnScreen && <OverlayMac item={item} autoRotateSpeed={autoRotateSpeed}/>}
            {isPublication && <OverlayBook item={item} autoRotateSpeed={autoRotateSpeed}/>}
        </div>
    )
}

export default Overlay


const OverlayMac = ({ item, autoRotateSpeed }: { item: TypeProject, autoRotateSpeed: number; }) => {
    // Handle

    return (
        <div 
        className={styles.overlay}
        >
            <Scene type="orbit" item={item} rotationSpeed={6}/>
        </div>
    )
}


const OverlayBook = ({ item, autoRotateSpeed }: { item: TypeProject; autoRotateSpeed: number; }) => {
    // Handle

    return (
        <div style={{ height: 400 }}>
            <ParametricBook type="orbit" item={item} setShowButton={() => {}} autoRotateSpeed={autoRotateSpeed}/>
        </div>
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
