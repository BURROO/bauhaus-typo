// 'use client'

import { TypeProject } from '@/types/project-type'
import styles from './Slideshow.module.css'
import {  useMemo, useState } from 'react';

import { getAssetSlideShow } from '@/util/getAssets';


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

        const slides = getAssetSlideShow({ item})

        return slides
    }, [])

    const [activeSlide, setActiveSlide ] = useState(0)

    const goNext = () => {

        setActiveSlide((activeSlide + 1) % slides.length)
    }
    const goPrev = () => {

        setActiveSlide((activeSlide - 1 + slides.length) % slides.length)
    }

    const fullScreen = item.COURSE === "Bauhaus Master Lectures"


    return (
        <>
            <div className={`${styles.slideshow} ${fullScreen ? styles.fullScreen : ''}`}>
                <div className={styles.wrapper} style={{
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
                {activeSlide > 0 && <div className={styles.goLeft} onClick={() => goPrev()}/>}
                {activeSlide < slides.length-1 && <div className={styles.goRight} onClick={() => goNext()} />}
            </div>
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