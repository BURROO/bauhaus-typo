'use client'

import { TypeProject } from '@/types/project-type'
import styles from './Website.module.css'
import { useMemo, useRef, useState, useEffect, useContext } from 'react'
import SceneMacbook from '@/components/landing/three/macbook/SceneMacbook'
import SceneWrapper from '@/components/landing/three/SceneWrapper'
import { CameraProps } from '@react-three/fiber'
import Button from '@/components/general/Button'
import { ButtonWrapper } from '../PageWrapper'
import { getAssetWebsite } from '@/util/getAssets'
import { ContextMenu } from '@/components/context/ContextMenu'
import { setDefaultAutoSelectFamily } from 'net'

interface Props {
    item: TypeProject
}

const Website = ({ item }: Props) => {

    const { src } = useMemo(() => {
     
        return { src : getAssetWebsite({ item })}
    }, [item])

    // const [view, setView] = useState<'video' | 'iframe'>('video')
    const { view, setView } = useContext(ContextMenu)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const iframeContainerRef = useRef<HTMLDivElement>(null)

    const interactCam: CameraProps = {
        position: [0, 0, 0.35],
        fov: 45,
    }

    const openFullscreenIframe = () => {
        requestAnimationFrame(() => {
            const el = iframeContainerRef.current
            if (!el) return

            if (el.requestFullscreen) el.requestFullscreen()
            else if ((el as any).webkitRequestFullscreen) {
                (el as any).webkitRequestFullscreen()
            }
        })
    }

    // 👇 Listen for ESC / fullscreen exit
    useEffect(() => {
        const onFullscreenChange = () => {
            const fullscreenEl =
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement

            setIsFullscreen(!!fullscreenEl)
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
            {view === 'inside' && src && (
                <div 
                ref={iframeContainerRef} 
                className={styles.websiteIframe}
                >
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
                    {isFullscreen &&
                        <div style={{ 
                            position: "absolute", 
                            top: 0, 
                            right: 0
                        }}>
                            <Button
                            onClick={() => setView("outside")}
                            text={'Close Fullscreen'}
                            />
                        </div>
                    }
                </div>
            )}

            {view === 'outside' && (
                <div className={styles.preview}>
                    <SceneWrapper camSettings={interactCam} type="interact" autoRotateSpeed={5}>
                        <SceneMacbook
                            item={item}
                            isDouble={false}
                            type="interact"
                            visible
                            // onClick={() => setView(view === 'iframe' ? 'video' : 'iframe')}
                            onClick={() => {

                                if(!website) return
                                // if(view === 'outside'){
                                //     openFullscreenIframe()
                                // }else{
                                //     setView('outside')
                                // }

                                setView("inside")
                            }}
                        />
                    </SceneWrapper>
                </div>
            )}

            {website && view === "inside" && <ButtonWrapper>
                <Button
                    onClick={() => setView("outside")}
                    text={'Look at Showcase'}
                />
                {view === "inside" && <Button
                    onClick={() => {
                        openFullscreenIframe()
                    }}
                    text={'Open Fullscreen'}
                />}
            </ButtonWrapper>}
        </div>
    )
}

export default Website
