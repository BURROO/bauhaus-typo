'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

type Props = {
  src: string
  loaderSrc?: string
  rotate: [number, number, number]
  position?: [number, number, number]
  size: [number, number]
}

export default function VideoPlane({
  src,
  loaderSrc,
  position,
  rotate,
  size,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [ready, setReady] = useState(false)
  const [usingLoader, setUsingLoader] = useState(true)

  // Initialize video only once
  if (!videoRef.current) {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    videoRef.current = video
  }

  useEffect(() => {
    const video = videoRef.current!
    const trySrc = async (srcToTry: string) => {
      video.src = srcToTry
      video.currentTime = 0

      // wait until video can play
      const canPlay = new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          resolve()
          video.removeEventListener('canplaythrough', onCanPlay)
        }
        const onError = () => {
          reject()
          video.removeEventListener('error', onError)
        }

        video.addEventListener('canplaythrough', onCanPlay)
        video.addEventListener('error', onError)
      })

      try {
        await canPlay
        await video.play()
        setReady(true)
        setUsingLoader(false)
      } catch {
        console.warn('Video playback blocked or failed', srcToTry)
        setReady(false)
        setUsingLoader(true)
      }
    }

    if (loaderSrc) {
      // start with loader first
      trySrc(loaderSrc).then(() => {
        // then try the real video
        if (src) trySrc(src)
      })
    } else {
      if (src) trySrc(src)
    }

    return () => {
      video.pause()
    }
  }, [src, loaderSrc])

  // create THREE texture once
  const texture = useMemo(() => {
    const tex = new THREE.VideoTexture(videoRef.current!)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    return tex
  }, [])

  return (
    <mesh position={position} rotation={rotate}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
        transparent
        opacity={ready ? 1 : 0.5} // fade in when ready
      />
    </mesh>
  )
}
