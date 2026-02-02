'use client'

import { useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TypeProject, courseShort } from '@/types/project-type'
import { fileDataIO } from '@/data/fileData'
import { sanitizeForUrl } from '@/util/sanitizeForUrl'
import { getAssetCover } from '@/util/getAssets'
import { useHover } from '@/components/hook/useHover'

interface Props {
  item: TypeProject | null
  visible: boolean;
  onClick?: () => void;
}

export default function SceneBook({
  item,
  visible,
  onClick
}: Props) {
  if (!item) return null
  
  const { setCursor } = useHover()
  
  return (
    <group
      rotation={[0, Math.PI, 0]}
      visible={visible}
      onPointerDown={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setCursor('pointer')
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setCursor('auto')
      }}
    >
      <Book item={item} />
    </group>
  )
}




/* ========================================================================== */
/* BOOK                                                                        */
/* ========================================================================== */

function Book({ item }: { item: TypeProject }) {
  const bookUrls = useMemo(() => {

    const cover= getAssetCover({ item })

    if(!cover) return null

    const { front, back, spine } = cover

    return { front, back, spine }
  }, [item.ID])

  if (!bookUrls) return null

  const [front, back, spineTex, pages, top, bottom] = useTexture([
    bookUrls.front,
    bookUrls.back,
    bookUrls.spine,
    // `/images/om/_general/pages.webp`,
    // `/images/om/_general/pages-top.webp`,
    // `/images/om/_general/pages-bottom.webp`,
    ``,
    ``,
    ``,
  ])

  const scale = useMemo<[number, number, number]>(() => {
    if (!front?.image || !spineTex?.image) return [0.16, 0.24, 0.028]

    const targetHeight = 0.24
    const frontImg = front.image as HTMLImageElement
    const spineImg = spineTex.image as HTMLImageElement

    const width = targetHeight * (frontImg.naturalWidth / frontImg.naturalHeight)
    const spine = targetHeight * (spineImg.naturalWidth / spineImg.naturalHeight)

    return [width, targetHeight, spine]
  }, [front, spineTex])

  const materials = useMemo(
    () => [
      mat(spineTex),
      mat(pages),
      mat(top),
      mat(bottom),
      mat(back),
      mat(front),
    ],
    [front, back, spineTex]
  )

  return (
    <mesh castShadow receiveShadow scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      {materials.map((m, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} {...m} />
      ))}
    </mesh>
  )
}

function mat(map?: THREE.Texture) {
  return {
    map,
    roughness: 0.8,
    metalness: 0.05,
    envMapIntensity: 0.4,
  }
}

