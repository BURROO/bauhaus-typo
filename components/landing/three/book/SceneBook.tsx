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

    const { 
      front,
      back, spine } = cover

    return { front, back, spine, transparent: transparentMat() }
  }, [item.ID])

  if (!bookUrls) return null

  const [
    front, 
    back, 
    spineTex, 
    // pages, top, bottom
  ] = useTexture([
    bookUrls.front,
    bookUrls.back,
    bookUrls.spine,
    // `/images/om/_general/pages.webp`,
    // `/images/om/_general/pages-top.webp`,
    // `/images/om/_general/pages-bottom.webp`,
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
    [front, back, spineTex]
  )



  // const 
  // console.log(scale)
  const thickness = scale[2]
  const spreadArea = thickness*0.999

  const count = Math.floor(spreadArea/0.0003)-1
  const pageThickness = spreadArea/count

  const pgs = useMemo(() => new Array(count).fill(0).map(() => Math.random()), [materials])

  // const pageThickness = spreadArea/pgs.length

  return (
    <>
      <mesh castShadow receiveShadow scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        {materials.map((m, i) => (
          <meshStandardMaterial 
          key={i} attach={`material-${i}`} {...m} 
          side={THREE.DoubleSide} 
          />
        ))}
      </mesh>
        {
          pgs.slice(0, pgs.length-1).map((randomVal, i) => {
            
            const tinyVal = randomVal*0.0001
            const variationSpace = 0.0005
            const y = variationSpace*Math.sin(randomVal)
            // const y = 0
            const grayTone = 1-randomVal*0.4
            // const color = `rgb(${grayTone},${grayTone},${grayTone})`
            // const color = new THREE.Color(`rgb(${grayTone},${grayTone},${grayTone})`)
            const color = new THREE.Color(grayTone, grayTone, grayTone)
            // const color = new THREE.Color(`rgb(255,0,0)`)

            // console.log(randomVal, color)

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
              {/* <planeGeometry args={[1, 1, 1]} /> */}
              <boxGeometry args={[1, 1, pageThickness/scale[2] ]} />
              {/* <meshPhysicalMaterial  */}
              <meshStandardMaterial 
              color={color}
              side={THREE.DoubleSide} 
              />
            </mesh>

          )})
        }
    </>
  )
}
    //  const mesh = child as THREE.Mesh

    //   // optional: override material
    //   mesh.material = new THREE.MeshStandardMaterial({
    //     // color: '#1f1f1f',
    //     color: '#363636',
    //     // roughness: 0.4,
    //     // metalness: 0.1,
    //     roughness: 0.4,
    //     metalness: 0.1,
    //     side: THREE.DoubleSide
    //   })

    //   // mesh.material.side = THREE.DoubleSide

    //   mesh.castShadow = true
    //   mesh.receiveShadow = true
    // }
//  THREE.MeshPhysicalMaterial({
//         map: txt,
//         transparent: true,
//         side: THREE.DoubleSide,
//         roughness: 0.6 - i * 0.15,   // top layer glossier
//         metalness: 0.05 + i * 0.02,
//         clearcoat: i === 0 ? 0.1 : 0,
//         clearcoatRoughness: 0.2,

//         normalScale: new THREE.Vector2(
//           // 1 + i * 0.2,
//           // 1 + i * 0.2
//           (i+1) * 0.02,
//           (i+1) * 0.02
//         ),
//       });

// function Book({ item }: { item: TypeProject }) {
//   const cover = getAssetCover({ item })
//   if (!cover) return null

//   const [front, back, spine] = useTexture([
//     cover.front,
//     cover.back,
//     cover.spine,
//   ])

//   const scale = useMemo<[number, number, number]>(() => {
//     if (!front?.image || !spine?.image) return [0.16, 0.24, 0.028]

//     const targetHeight = 0.24
//     const frontImg = front.image as HTMLImageElement
//     const spineImg = spine.image as HTMLImageElement

//     const width =
//       targetHeight * (frontImg.naturalWidth / frontImg.naturalHeight)

//     const depth =
//       targetHeight * (spineImg.naturalWidth / spineImg.naturalHeight)

//     return [width, targetHeight, depth]
//   }, [front, spine])


//   return (
//     <group scale={scale}>
//       {/* front */}
//       <Cover map={front} positionZ={0.001} />

//       {/* pages */}
//       <Pages count={32} thickness={0.001} />

//       {/* back */}
//       <Cover map={back} positionZ={-0.034} />

//       {/* spine */}
//       <Spine map={spine} width={0.04} />
//     </group>
//   )
// }


// function Cover({
//   map,
//   positionZ,
// }: {
//   map: THREE.Texture
//   positionZ: number
// }) {
//   return (
//     <mesh position={[0, 0, positionZ]}>
//       <planeGeometry args={[1, 1]} />
//       <meshStandardMaterial
//         map={map}
//         roughness={0.8}
//         metalness={0.05}
//       />
//     </mesh>
//   )
// }

// function Pages({
//   count = 24,
//   thickness = 0.001,
// }: {
//   count?: number
//   thickness?: number
// }) {
//   return (
//     <group>
//       {Array.from({ length: count }).map((_, i) => (
//         <mesh
//           key={i}
//           position={[0, 0, -i * thickness]}
//         >
//           <planeGeometry args={[0.98, 0.98]} />
//           <meshStandardMaterial
//             color="#f2f2f0"
//             roughness={0.9}
//           />
//         </mesh>
//       ))}
//     </group>
//   )
// }

// function Spine({
//   map,
//   width,
// }: {
//   map: THREE.Texture
//   width: number
// }) {
//   return (
//     <mesh position={[-0.5 + width / 2, 0, -0.5]}>
//       <boxGeometry args={[width, 1, 1]} />
//       <meshStandardMaterial map={map} side={THREE.DoubleSide}/>
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
    transparent: true,
    opacity: 0,
    depthWrite: false,
  }
}