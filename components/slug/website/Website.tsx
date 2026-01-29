'use client'

import { courseShort, TypeProject } from '@/types/project-type'
import styles from './Website.module.css'
import { useEffect, useRef, useState } from 'react'
import { getUrlVideo, sanitizeForUrl } from '@/util/sanitizeForUrl'
import SceneMacbook from '@/components/landing/three/macbook/SceneMacbook'

interface Props {
    item: TypeProject
}

const Website = ({ item }: Props) => {

    // 1. Build local path
    const cleanedSnippet = item.Link
        ?.split('.')[0]
        ?.split('/')
        ?.pop()


    const name = sanitizeForUrl(item.NAME).split("-").join("_")
    // const showcaseSource = 

    const subFulter = courseShort[item.COURSE].toLocaleLowerCase()
    // const subFulter = item.COURSE === 'Transcoding Typography' ? 'tt' : 'pz'

    const [src, setSrc] = useState<string>(`/websites/${subFulter}/${name}/index.html`)

    // const [view, setView] = useState<'video'|'iframe'>('video')
    const [view, setView] = useState<'video'|'iframe'>('iframe')

    const videoUrl = getUrlVideo(item)

    return (
        <div className={styles.website}>
            <button 
            className={styles.switch}
            onClick={() => setView(view === "iframe" ? "video" : "iframe")}>{
                view === "video" ? "Try Website" : "See Showcase"}
            </button>
            {
                view === 'iframe' && src &&(
                    <WebIframe src={src} />
                )
            }
            {
                view === "video" && (
                    <div className={styles.preview}>

                        {/* <video src={videoUrl} muted autoPlay loop={true}/> */}
                        <SceneMacbook item={item} rotationSpeed={0} type='interact'/>
                    </div>
                )
            }
        </div>
    )
}


export default Website



const WebIframe = ({ src }: { src: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)


    const [isFullScreen, setIsFullScreen] = useState(false)

    const enterFullscreen = () => {
        const el = containerRef.current
        if (!el) return

        if (el.requestFullscreen) {
            el.requestFullscreen()
        // Safari
        } else if ((el as any).webkitRequestFullscreen) {
            (el as any).webkitRequestFullscreen()
        }

        setIsFullScreen(true)
    }

    return (
        <div ref={containerRef} className={styles.websiteIframe}>
            <iframe  src={src} />
            {!isFullScreen &&<button 
            className={styles.btnFullscreen} 
            onClick={enterFullscreen}
            >
                Fullscreen
            </button>}
        </div>

    )
}