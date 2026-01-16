'use client'

import { TypeProject } from '@/types/project-type'
import styles from './BookContent.module.css'
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface Props{
    item: TypeProject;
    onClick: () => void;
}

const BookContent = ({ item, onClick }: Props) => {

    // 
    const [slides, setSlides] = useState<string[]>([])

    // useEffect(() => {
    //   let mounted = true
    //
    //   pdfToSlides('/images/ioom/mona_content.pdf')
    //     .then(result => {
    //       if (mounted) setSlides(result)
    //     })
    //
    //   return () => {
    //     mounted = false
    //   }
    // }, [])

    return (
        <div className={styles.bookContent}>
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
                </div>
            </div>
        </div>
    )
}



export default BookContent