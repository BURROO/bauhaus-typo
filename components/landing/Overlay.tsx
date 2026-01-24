import { TypeProject } from '@/types/project-type';
import styles from './Overlay.module.css'
import ParametricBook from '../slug/book/ParametricBook';
import Scene from './three/Scene';
// import dynamic from 'next/dynamic';


// const Scene = dynamic(
//   () => import("./three/Scene"),
//   { ssr: false }
// );


const Overlay = ({ item }: {item: TypeProject; }) => {


    if(typeof item === "undefined") return <></>

    return (
            <div 
            className={styles.overlay}
            >
                {item["Type"] === "WWW" && <OverlayTranscoding item={item} />}
                {item["Kurs"] === "In Order Of Meaning" && <OverlayOrderOfMeaning item={item} />}
            </div>
    )
}

export default Overlay


const OverlayTranscoding = ({ item }: { item: TypeProject }) => {
    // Handle



    return (
        <div 
        className={styles.overlay}
        >
            <Scene item={item}/>
        </div>
    )
}


const OverlayOrderOfMeaning = ({ item }: { item: TypeProject }) => {
    // Handle

    return (
        <div style={{ height: 400 }}>
            <ParametricBook type="orbit" item={item} setShowButton={() => {}}/>
        </div>
    )
}