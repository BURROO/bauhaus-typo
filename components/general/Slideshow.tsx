// 'use client'

import { TypeProject } from '@/types/project-type'
import styles from './Slideshow.module.css'
import {  useEffect, useMemo, useState } from 'react';

import { getAssetSlideShow } from '@/util/getAssets';
import { useMousePos } from '../hook/useMousePos';
import Button from './Button';


interface Props{
    item: TypeProject;
    // setShowButton: (value: boolean) => void;
    isBook?: boolean;
}


const Slideshow = ({
    item,
    // setShowButton,
    isBook 
}: Props) => {

    const slides = useMemo(() => {

        const slides = getAssetSlideShow({ item })

        return slides
    }, [])

    const [activeSlide, setActiveSlide ] = useState(0)

    const goNext = () => {

        setActiveSlide((activeSlide + 1) % slides.length)
    }
    const goPrev = () => {

        setActiveSlide((activeSlide - 1 + slides.length) % slides.length)
    }

    const fullScreen = 
        item.COURSE === "Bauhaus Master Lectures" ||
        item.COURSE === "Bauhaus Inhouse" ||
        item.NAME === "August Guccione"


    const [hoverText, setHoverText ] = useState<string|null>(null)

    const {mousePos} = useMousePos({}, !!hoverText)

    return (
        <>
            <div className={`${styles.slideshow} ${fullScreen ? styles.fullScreen : ''}`}>
                <div 
                className={styles.wrapper} 
                onMouseOver={() => {
                    setHoverText(null)
                }}
                // onMouseMove={() => {
                //     setHoverText(null)
                // }}
                style={{
                    transform: `translateX(${-activeSlide * 100}vw)`
                }}>
                    {
                        slides.map((slide) => (
                            <div
                            key={slide}
                            className={styles.slide}
                            // onMouseEnter={() => setShowButton(true)}
                            // onMouseLeave={() => setShowButton(false)}
                            >
                                <img src={`${slide}`} />
                                {
                                    isBook && (
                                        <>
                                            <div className={styles.shadowLeft} />
                                            <div className={styles.shadowRight} />
                                        </>
                                    )
                                }

                            </div>
                        ))
                    }
                </div>
                {/* {activeSlide > 0 && ( */}
                    <div
                    className={styles.goLeft}
                    onClick={() => {
                        goPrev()
                        setHoverText(activeSlide > 0 ? 'Look at previous' : 'Look at last spread')
                    }}
                    onMouseOver={() => {
                        setHoverText(activeSlide > 0 ? 'Look at previous' : 'Look at last spread')
                    }}
                    onMouseEnter={() => {
                        // setHoverText('Look at previous')
                        setHoverText(activeSlide > 0 ? 'Look at previous' : 'Look at last spread')
                    }}
                    onMouseLeave={() => {
                        setHoverText(null)
                    }}
                    />
                {/* )} */}
                {/* {activeSlide < slides.length-1 && ( */}
                    <div 
                    className={styles.goRight} 
                    onClick={() => {
                        goNext()
                        setHoverText(activeSlide < slides.length-1 ? 'Look at next' : 'Look at first spread')
                    }} 
                
                    onMouseOver={() => {
                        setHoverText(activeSlide < slides.length-1 ? 'Look at next' : 'Look at first spread')
                    }}
                    onMouseEnter={() => {
                        setHoverText(activeSlide < slides.length-1 ? 'Look at next' : 'Look at first spread')
                    }}
                    onMouseLeave={() => {
                        setHoverText(null)
                    }}
                    />
                {/* )} */}
            </div>
            {
                mousePos &&
                hoverText && 
                <div style={{ position: 'fixed', left: mousePos?.x+ 20, top: mousePos.y - 20, pointerEvents: "none"}} >
                    <Button text={hoverText} onClick={() => {
                        // 
                    }}/>
                </div>
            }
            {/* <div className={styles.thumbails}>
                {
                    slides.map((slide, i) => (
                        <div 
                        key={i}
                        className={`${styles.thumbnailItem} ${i === activeSlide ? styles.active : ""}`} 
                        onClick={() => setActiveSlide(i)}
                        >
                            <img src={`${slide}`} />

                        </div>
                    ))
                }
            </div> */}
        </>
    )
}



export default Slideshow