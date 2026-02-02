'use client'

import { TypeProject } from '@/types/project-type'
import styles from './Website.module.css'
import { useMemo, useRef, useState, useEffect } from 'react'
import SceneMacbook from '@/components/landing/three/macbook/SceneMacbook'
import SceneWrapper from '@/components/landing/three/SceneWrapper'
import { CameraProps } from '@react-three/fiber'
import Button from '@/components/general/Button'
import { ButtonWrapper } from '../PageWrapper'
import { getAssetWebsite } from '@/util/getAssets'

interface Props {
    item: TypeProject
}

const Website = ({ item }: Props) => {

    // 
    const { src } = useMemo(() => {
     
        return { src : getAssetWebsite({ item })}
    }, [item])

    const [view, setView] = useState<'video' | 'iframe'>('video')
    const iframeContainerRef = useRef<HTMLDivElement>(null)

    const interactCam: CameraProps = {
        position: [0, 0, 0.35],
        fov: 45,
    }

    const openFullscreenIframe = () => {
        setView('iframe')

        // requestAnimationFrame(() => {
        //     const el = iframeContainerRef.current
        //     if (!el) return

        //     if (el.requestFullscreen) el.requestFullscreen()
        //     else if ((el as any).webkitRequestFullscreen) {
        //         (el as any).webkitRequestFullscreen()
        //     }
        // })
    }

    // 👇 Listen for ESC / fullscreen exit
    useEffect(() => {
        const onFullscreenChange = () => {
            const isFullscreen =
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement

            if (!isFullscreen) {
                // Fullscreen exited → stay on iframe preview
                setView('video')
            }
        }

        document.addEventListener('fullscreenchange', onFullscreenChange)
        document.addEventListener('webkitfullscreenchange', onFullscreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange)
            document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
        }
    }, [])

    const website = getAssetWebsite({ item })

    return (
        <div className={styles.website}>
            {view === 'iframe' && src && (
                <div ref={iframeContainerRef} className={styles.websiteIframe}>
                    <iframe
                    src={src}
                    // src="/websites/tt/hannes_altmann/index.html"
                    allowFullScreen
                    // sandbox="allow-scripts allow-same-origin"
                    //   sandbox="
                    //     allow-scripts
                    //     allow-same-origin
                    //     allow-forms
                    //     allow-pointer-lock
                    //     allow-popups
                    //     allow-modals
                    //     allow-top-navigation-by-user-activation
                    //   "
                    />
                </div>
            )}

            {view === 'video' && (
                <div className={styles.preview}>
                    <SceneWrapper camSettings={interactCam} type="interact" autoRotateSpeed={5}>
                        <SceneMacbook
                            item={item}
                            isDouble={false}
                            type="interact"
                            visible
                            // onClick={() => setView(view === 'iframe' ? 'video' : 'iframe')}
                            onClick={
                                view === 'video'
                                    ? openFullscreenIframe
                                    : () => setView('video')
                            }
                        />
                    </SceneWrapper>
                </div>
            )}

            {website && <ButtonWrapper>
                <Button
                    onClick={
                        view === 'video'
                            ? openFullscreenIframe
                            : () => setView('video')
                    }
                    text={view === 'video' ? 'Try Website' : 'See Showcase'}
                />
            </ButtonWrapper>}
        </div>
    )
}

export default Website
