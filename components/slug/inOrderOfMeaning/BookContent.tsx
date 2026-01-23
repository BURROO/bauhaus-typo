// 'use client'

import { TypeProject } from '@/types/project-type'
import styles from './BookContent.module.css'
import { useEffect, useMemo, useState } from 'react';
// import { pdfjs } from 'react-pdf';
// import { Document, Page } from 'react-pdf';
import { fromPath } from "pdf2pic";


import 'react-pdf/dist/Page/AnnotationLayer.css'


interface Props{
    item: TypeProject;
    onClick: () => void;
}



const data = {
    mona_kerntke: {
        dir: `/images/ioom/content/mona_kerntke`,
        count: 5,
    }
}

const BookContent = ({ item, onClick }: Props) => {


    // }, [])


    const slides = useMemo(() => {
        // 
        const slides = []

        const count = data["mona_kerntke"].count
        const dir = data["mona_kerntke"].dir

        for(let i = 1; i <= count;i++){

            slides.push(`${dir}/slide-${i}.png`)
        }

        return slides
    }, [])


    const [activeSlide, setActiveSlide ] = useState(0)


    return (
        <div className={styles.bookContent}>
            <div className={styles.button} onClick={onClick}>Cover</div>
            <div className={styles.slideshow}>
                <div className={styles.wrapper} style={{
                    transform: `translateX(${-activeSlide * 100}vw)`
                }}>
                    {
                        slides.map((slide) => (
                            <div className={styles.slide}>
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