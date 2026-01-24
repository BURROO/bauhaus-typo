'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  src: string
  rotate: [number, number, number]
  position?: [number, number, number]
  size: [number, number]
}

export default function VideoPlane({
  src,
  position,
  rotate,
  // size = [2, 1.125],
  size,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = src
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true

    video.play().catch(() => {
      console.warn('Video playback blocked (needs user interaction)')
    })

    videoRef.current = video
  }, [src])

  if (!videoRef.current) return null

  const texture = new THREE.VideoTexture(videoRef.current)
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh position={position} rotation={rotate}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}




// 'use client'

// import { useEffect, useRef } from 'react'
// import { useFrame } from '@react-three/fiber'
// import * as THREE from 'three'

// type Props = {
//   src: string
//   position?: [number, number, number]
//   size?: [number, number]
// }

// export default function VideoPlane({
//   src,
//   position = [0, 0, -2],
//   size = [2, 1.125],
// }: Props) {
//   const meshRef = useRef<THREE.Mesh>(null)
//   const video = useRef<HTMLVideoElement>(null)

//   useEffect(() => {
//     video.current = document.createElement('video')
//     video.current.src = src
//     video.current.crossOrigin = 'anonymous'
//     video.current.loop = true
//     video.current.muted = true
//     video.current.playsInline = true
//     video.current.play()
//   }, [src])

//   useFrame(() => {
//     if (meshRef.current && video.current) {
//       const texture = new THREE.VideoTexture(video.current)
//       texture.colorSpace = THREE.SRGBColorSpace
//       // @ts-ignore
//       meshRef.current.material.map = texture
//       // @ts-ignore
//       meshRef.current.material.needsUpdate = true
//     }
//   })

//   return (
//     <mesh ref={meshRef} position={position}>
//       <planeGeometry args={size} />
//       <meshBasicMaterial toneMapped={false} />
//     </mesh>
//   )
// }
