import { useEffect, useState } from 'react';
import styles from './TypeLarge.module.css'

interface Props {
    text: string;
}


const TypeLarge = ({ text }: Props) => {

    const [showIntro, setShowIntro] = useState(true)

    // useEffect(() => {
    //     const timeout = setTimeout(() => {

    //         setShowIntro(false)

    //     }, 1000)

    //     return () => {
    //         clearTimeout(timeout)
    //     }
    // }, [])


    // if(!showIntro) return <></>

    return (
        <div className={styles.typeLarge}>
            {text.split("\\").map((txt, i, all) => (
                <h2 key={i}>
                    {txt.split('').map((ltr, j) => (
                        <span key={j}
                        style={{
                            // background: i % 2 !== 0 ? "white" : "black",
                            // color: i % 2 === 0 ? "white" : "black"
                        }}
                        
                        >{ltr}</span>
                    ))}
                
                    {/* {i < all.length-1 && <><br/><br/></>} */}
                </h2>
            ))}
            {/* <h1>Typography & Type Design</h1>
            <h2>Exhibition</h2>
            <h2>06.–0.8.02.2026</h2> */}
            {/* <h2>Typography & Type Design</h2> */}
            {/* Handle Type large */}
            {/* <SVG /> */}
            
        </div>
    )
}

export default TypeLarge



const SVG = () => {


    const [viewPort, setViewPort ] = useState({
        width: 0,
        height: 0,
    })
 

    useEffect(() => {

        const handleResize = () => {

            setViewPort({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        handleResize()
        window.addEventListener("resize", handleResize)


        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [])


    return (
        <svg viewBox={`0 0 ${viewPort.width} ${viewPort.height}`}>

        </svg>
    )
}