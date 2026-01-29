'use client'

import { courseShort, TypeProject } from '@/types/project-type'
import styles from './Website.module.css'
import { useEffect, useRef, useState } from 'react'
import { getUrlVideo, sanitizeForUrl } from '@/util/sanitizeForUrl'
import Scene from '@/components/landing/three/Scene'

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

    console.log(item.COURSE)


    const subFulter = courseShort[item.COURSE].toLocaleLowerCase()
    // const subFulter = item.COURSE === 'Transcoding Typography' ? 'tt' : 'pz'


    // const [src, setSrc] = useState<string>(`/websites/${subFulter}/${cleanedSnippet}/index.html`)
    const [src, setSrc] = useState<string>(`/websites/${subFulter}/${name}/index.html`)

    // console.log("src", `/websites/${subFulter}/${cleanedSnippet}/index.html`)
    const [isLocal, setIsLocal ] = useState(true)

    // const [prefereLocal, setPrefereLocal] = useState(false)
    const [prefereLocal, setPrefereLocal] = useState(true)

    console.log("src", src)

    // useEffect(() => {
    //     let cancelled = false


    //     if(!prefereLocal){

    //         setIsLocal(true)
    //         setSrc(item.Link);

    //         return 
    //     }else{
    //         async function resolveSource() {
    //             if (!src) {
    //                 setSrc(item.Link)
    //                 setIsLocal(false)
    //                 return
    //             }

    //             try {
    //                 // 2. Check if local file exists
    //                 const res = await fetch(src, { method: 'HEAD' })

    //                 if (!cancelled) {
    //                     setSrc(res.ok ? src : item.Link)
    //                     if(!res.ok) setIsLocal(false)
    //                 }
    //             } catch {
    //                 if (!cancelled) {
    //                     setSrc(item.Link)
    //                     setIsLocal(false)
    //                 }
    //             }
    //         }

    //         resolveSource()

    //     }


    //     return () => {
    //         cancelled = true
    //     }
    // }, [item.Link, src, prefereLocal])


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
                        <Scene item={item} rotationSpeed={0} type='interact'/>
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