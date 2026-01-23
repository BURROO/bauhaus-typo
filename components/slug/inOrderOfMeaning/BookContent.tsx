// 'use client'

import { TypeProject } from '@/types/project-type'
import styles from './BookContent.module.css'
import { useEffect, useMemo, useState } from 'react';


import 'react-pdf/dist/Page/AnnotationLayer.css'
import { fileDataIO } from '@/data/fileData';


interface Props{
    item: TypeProject;
    setShowButton: (value: boolean) => void;
}


const BookContent = ({ item, setShowButton }: Props) => {


    // }, [])


    const slides = useMemo(() => {


        const student = item.Studierende.toLowerCase().split(" ").join("_")
        // 
        const slides = []
        // @ts-ignore
        const count = (fileDataIO[student] || fileDataIO["mona_kerntke"]).count
        // @ts-ignore
        const dir = (fileDataIO[student] || fileDataIO["mona_kerntke"]).dir

        for(let i = 1; i <= count;i++){

            slides.push(`${dir}/slide-${i}.png`)
        }

        return slides
    }, [])


    const [activeSlide, setActiveSlide ] = useState(0)


    return (
        <div className={styles.bookContent}>
            <div className={styles.slideshow}>
                <div className={styles.wrapper} style={{
                    transform: `translateX(${-activeSlide * 100}vw)`
                }}>
                    {
                        slides.map((slide) => (
                            <div
                            className={styles.slide}
                            onMouseEnter={() => setShowButton(true)}
                            onMouseLeave={() => setShowButton(false)}
                            >
                                <img src={`${slide}`} />

                            </div>
                        ))
                    }
                </div>
                <div className={styles.thumbails}>
                    {
                        slides.map((slide, i) => (
                            <div 
                            className={`${styles.thumbnailItem} ${i === activeSlide ? styles.active : ""}`} 
                            onClick={() => setActiveSlide(i)}
                            >
                                <img src={`${slide}`} />

                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}



export default BookContent