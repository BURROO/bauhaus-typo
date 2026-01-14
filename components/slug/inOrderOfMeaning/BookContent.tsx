'use client'

import { TypeProject } from '@/types/project-type'
import styles from './BookContent.module.css'
import { useEffect, useState } from 'react';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css'

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc =
  '/pdf.worker.min.js'
//   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'



const slides = [
    `/images/ioom/front.jpg`,
    `/images/ioom/back.jpg`,
    `/images/ioom/front.jpg`,
    `/images/ioom/back.jpg`,
]


interface Props{
    item: TypeProject;
    onClick: () => void;
}


const BookContent = ({ item, onClick }: Props) => {
  const [slides, setSlides] = useState<string[]>([])

//   useEffect(() => {
//     let mounted = true

//     pdfToSlides('/images/ioom/mona_content.pdf')
//       .then(result => {
//         if (mounted) setSlides(result)
//       })

//     return () => {
//       mounted = false
//     }
//   }, [])


    return (
        <div className={styles.bookContent}>
            {/*  */}
            <div onClick={onClick}>Cover</div>
            <div className={styles.slideshow}>
                <div className={styles.wrapper}>
                    <Document 
                    file="/images/ioom/content/mona_content.pdf"
                    loading="Loading PDF…"
                    error="Failed to load PDF"
                    onError={(err) => console.log(err)}
                    >
                        <Page pageNumber={1} />
                    </Document>
                    {/* {
                        slides.map((slide, i) => {


                            return (
                                <div key={i} className={styles.slide}>

                                </div>
                            )
                        })
                    } */}

                </div>
            </div>
        </div>
    )
}



export default BookContent