'use client'

import { useContext, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TypeProject } from '@/types/project-type'
import { getAssetCardBox, getAssetCards } from '@/util/getAssets'
import { useHover } from '@/components/hook/useHover'
import { ContextMenu } from '@/components/context/ContextMenu'

interface Props {
  item: TypeProject | null
  visible: boolean;
  onClick?: () => void;
}

export default function SceneCard({
  item,
  visible,
  onClick,
}: Props) {
  if (!item) return null


  const { setIsHovered } = useContext(ContextMenu)
  
  const { setCursor } = useHover()

  // const cards = useMemo(() => getAssetCards({ item }), [item])

  
  return (
    <group
      rotation={[0, Math.PI, 0]}
      visible={visible}
      onPointerDown={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setCursor('pointer')
        setIsHovered(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setCursor('auto')
        setIsHovered(false)
      }}
    >
      <CardBox item={item} />
      {/* {
        cardsWithTextures.map((c, i) => (
          <Card key={i} item={c}/>
        ))
      } */}
    </group>
  )
}




/* ========================================================================== */
/* Card                                                                        */
/* ========================================================================== */

function CardBox({ item }: { item: TypeProject }) {




    const cardBoxUrls = useMemo(() => {

    const cover = getAssetCardBox({ item })



    if(!cover) return null

    const { 
      front,
      back
    } = cover

    return { front, back, transparent: transparentMat() }
  }, [item.ID])

  if (!cardBoxUrls) return null

  const [
    front, 
    back, 
    // spineTex, 
    // pages, top, bottom
  ] = useTexture([
    cardBoxUrls.front,
    cardBoxUrls.back,
  ])

  const scale = useMemo<[number, number, number]>(() => {
    // if (!front?.image || !spineTex?.image) return [0.16, 0.24, 0.028]

    const targetHeight = 0.24
    const frontImg = front.image as HTMLImageElement
    // const spineImg = spineTex.image as HTMLImageElement

    const width = targetHeight * (frontImg.naturalWidth / frontImg.naturalHeight)
    // const spine = targetHeight * (spineImg.naturalWidth / spineImg.naturalHeight)
    const spine = targetHeight * 0.2

    return [width, targetHeight, spine]
  }, [front])

  const materials = useMemo(
    () => [
      // mat(spineTex),
      transparentMat(),
      transparentMat(),
      transparentMat(),
      transparentMat(),
      mat(back),
      mat(front),
      // mat(spineTex),
      // mat(pages),
      // mat(top),
      // mat(bottom),
      // mat(back),
      // mat(front),
    ],
    [front, back]
  )


  return (
    <>
      <mesh castShadow receiveShadow scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        {materials.map((m, i) => (
          <meshStandardMaterial 
          key={i} 
          // color="hotpink"
          attach={`material-${i}`} {...m} 
          side={THREE.DoubleSide} 
          />
        ))}
      </mesh>
      {/* {
        pgs.slice(0, pgs.length-1).map((randomVal, i) => {
          
          const tinyVal = randomVal*0.0001
          const variationSpace = 0.0005
          const y = variationSpace*Math.sin(randomVal)
          const grayTone = 1-randomVal*0.4
          const color = new THREE.Color(grayTone, grayTone, grayTone)

          return (
          <mesh 
          key={i}
          castShadow 
          receiveShadow 
          scale={scale} 
          position={[
            -0.0004,
            y,
            -spreadArea/2+pageThickness+pageThickness*i
          ]}
          rotation={[0, tinyVal, tinyVal]}
          >
            <boxGeometry args={[1, 1, pageThickness/scale[2] ]} />
            <meshStandardMaterial 
            color={color}
            side={THREE.DoubleSide} 
            />
          </mesh>

        )})
      } */}
    </>
  )
}

// function Card({ item }: { item: any }) {

//   const textureUrl = item?.src ?? item?.image
//   const texture = useTexture(textureUrl)

//   const height = 0.16
//   const img = texture.image as HTMLImageElement
//   const width = height * (img.naturalWidth / img.naturalHeight)
//   return (
//     <mesh castShadow receiveShadow>
//       <planeGeometry args={[width, height]} />
//       <meshStandardMaterial
//         map={texture}
//         roughness={0.9}
//         metalness={0.05}
//         side={THREE.DoubleSide}
//       />
//     </mesh>
//   )
// }


function mat(map?: THREE.Texture) {
  return {
    map,
    roughness: 0.8,
    metalness: 0.05,
    envMapIntensity: 0.4,
  }
}

function transparentMat() {
  return {
    transparent: false,
    opacity: 1,
    depthWrite: true,
    color: new THREE.Color("white")
  }
}

function rand(seed: number, min = 0, max = 1) {
  const x = Math.sin(seed * 9999) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

