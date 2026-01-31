'use client'

import { courseShort, TypeProject } from '@/types/project-type'
import styles from './Website.module.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getUrlVideo, sanitizeForUrl } from '@/util/sanitizeForUrl'
import SceneMacbook from '@/components/landing/three/macbook/SceneMacbook'
import SceneWrapper from '@/components/landing/three/SceneWrapper'
import { CameraProps } from '@react-three/fiber'
import Button from '@/components/general/Button'

interface Props {
    item: TypeProject
}

const Website = ({ item }: Props) => {



    const { src } = useMemo(() => {

        // 
        const name = sanitizeForUrl(item.NAME).split("-").join("_")
        // const showcaseSource = 

        const subFulter = courseShort[item.COURSE].toLocaleLowerCase()
        // const subFulter = item.COURSE === 'Transcoding Typography' ? 'tt' : 'pz'

        const src = `/websites/${subFulter}/${name}/index.html`

        return { src }

    }, [item])


    // const [view, setView] = useState<'video'|'iframe'>('video')
    // const [view, setView] = useState<'video'|'iframe'>('iframe')
    const [view, setView] = useState<'video'|'iframe'>('video')


    const interactCam: CameraProps = {
        position: [
            0.0, 
            0.0, 
            0.35
        ], 
        fov: 45 
    }

    return (
        <div className={styles.website}>
            <div 
            className={styles.switch}
            onClick={() => setView(view === "iframe" ? "video" : "iframe")}>
                     <Button 
                    onClick={() => setView(view === "iframe" ? "video" : "iframe")}
                    text={view === "video" ? "Try Website" : "See Showcase"}
                    />
            </div>
            {
                view === 'iframe' && src &&(
                    <WebIframe src={src} />
                )
            }
            {
                view === "video" && (
                    <div className={styles.preview}>
                        <SceneWrapper
                        camSettings={interactCam}
                        type={"interact"}
                        autoRotateSpeed={0}
                        >
                            <SceneMacbook
                            item={item}
                            isDouble={false}
                            type='interact'
                            visible={true}
                            />
                        </SceneWrapper>
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