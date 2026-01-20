'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  src: string
  position?: [number, number, number]
  size?: [number, number]
}

export default function VideoPlane({
  src,
  position = [0, 0, -2],
  size = [2, 1.125],
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    video.current = document.createElement('video')
    video.current.src = src
    video.current.crossOrigin = 'anonymous'
    video.current.loop = true
    video.current.muted = true
    video.current.playsInline = true
    video.current.play()
  }, [src])

  useFrame(() => {
    if (meshRef.current && video.current) {
      const texture = new THREE.VideoTexture(video.current)
      texture.colorSpace = THREE.SRGBColorSpace
      // @ts-ignore
      meshRef.current.material.map = texture
      // @ts-ignore
      meshRef.current.material.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial toneMapped={false} />
    </mesh>
  )
}
