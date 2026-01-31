'use client'

import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TypeProject, courseShort } from '@/types/project-type'
import { fileDataIO } from '@/data/fileData'
import { sanitizeForUrl } from '@/util/sanitizeForUrl'

interface Props {
  item: TypeProject | null
  visible: boolean
}

// export default function SceneBook({
//   item,
//   setShowButton,
//   visible,
// }: Props) {

//   /* -------------------------------------------------- */
//   /* URLs                                                */
//   /* -------------------------------------------------- */

//   const bookUrls = useMemo(() => {
//     if (!item) {
//       return { front: '', back: '', spine: '' }
//     }

//     const filenameFallback = 'mona_kerntke'
//     const name = item.NAME
//       ? sanitizeForUrl(item.NAME).replaceAll('-', '_')
//       : filenameFallback

//     const courseFolder = courseShort[item.COURSE]?.toLowerCase()
//     if (!courseFolder) {
//         return null
//     }
//     // @ts-ignore
//     const studentName = fileDataIO[name] ? name : filenameFallback
//     const format = 'webp'

//     return {
//       front: `/images/${courseFolder}/${studentName}/${studentName}_front.${format}`,
//       back: `/images/${courseFolder}/${studentName}/${studentName}_back.${format}`,
//       spine: `/images/${courseFolder}/${studentName}/${studentName}_spine.${format}`,
//     }
//   }, [item?.ID])

//   /* -------------------------------------------------- */
//   /* Physical dimensions (meters-ish)                   */
//   /* -------------------------------------------------- */

//   const [width, setWidth] = useState(0.16)
//   const [height, setHeight] = useState(0.24)
//   const [spine, setSpine] = useState(0.028)

//   /* -------------------------------------------------- */
//   /* Stable callback from <Book />                      */
//   /* -------------------------------------------------- */

//   const handleCoverDims = useCallback(
//     ({ front, spine }: { front: { aspect: number }; spine: { aspect: number } }) => {
//       const targetHeight = 0.24

//       const nextWidth = targetHeight * front.aspect
//       const nextSpine = targetHeight * spine.aspect

//       setHeight(h => (h !== targetHeight ? targetHeight : h))
//       setWidth(w => (w !== nextWidth ? nextWidth : w))
//       setSpine(s => (s !== nextSpine ? nextSpine : s))
//     },
//     []
//   )

//   /* -------------------------------------------------- */

//   return (
//     <group
//       rotation={[0, Math.PI, 0]}
//       onPointerEnter={() => setShowButton(true)}
//       onPointerLeave={() => setShowButton(false)}
//       visible={visible}
//     >
//       {bookUrls && <Book
//         width={width}
//         height={height}
//         spine={spine}
//         frontUrl={bookUrls.front}
//         backUrl={bookUrls.back}
//         spineUrl={bookUrls.spine}
//         onDimensions={handleCoverDims}
//       />}
//     </group>
//   )
// }

export default function SceneBook({
  item,
  visible,
}: Props) {
  if (!item) return null

  return (
    <group
      rotation={[0, Math.PI, 0]}
      visible={visible}
    //   onPointerEnter={() => setShowButton(true)}
    //   onPointerLeave={() => setShowButton(false)}
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
    const courseFolder = courseShort[item.COURSE]
    if (!courseFolder) return null

    const fallback = 'mona_kerntke'
    const name = item.NAME
      ? sanitizeForUrl(item.NAME).replaceAll('-', '_')
      : fallback

    // @ts-ignore
    const studentName = fileDataIO[name] ? name : fallback
    const format = 'webp'

    return {
      front: `/images/${courseFolder.toLowerCase()}/${studentName}/${studentName}_front.${format}`,
      back: `/images/${courseFolder.toLowerCase()}/${studentName}/${studentName}_back.${format}`,
      spine: `/images/${courseFolder.toLowerCase()}/${studentName}/${studentName}_spine.${format}`,
    }
  }, [item.ID])

  if (!bookUrls) return null

  const [front, back, spineTex, pages, top, bottom] = useTexture([
    bookUrls.front,
    bookUrls.back,
    bookUrls.spine,
    `/images/om/_general/pages.jpg`,
    `/images/om/_general/pages-top.jpg`,
    `/images/om/_general/pages-bottom.jpg`,
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


// // 'use client'

// // import { useEffect, useMemo, useState } from "react";
// // import { useTexture } from "@react-three/drei";
// // import { courseShort, TypeProject } from "@/types/project-type";
// // import  * as THREE from 'three'
// // import { fileDataIO } from "@/data/fileData";
// // import { sanitizeForUrl } from "@/util/sanitizeForUrl";

// // interface Props{
// //     item: TypeProject|null;
// //     setShowButton: (value: boolean) => void;
// //     visible: boolean;
// // }

// // export default function SceneBook({ 
// //     item, 
// //     setShowButton, 
// //     visible
// // }: Props) {

// //     // const type = activeProject && getType(activeProject)

// //     const bookUrls = useMemo(() => {

// //         if(item === null){
// //             return {
// //                 front: '',
// //                 back: '',
// //                 spine: ''
// //             }
// //         }
// //         const filenameFallback = 'mona_kerntke'
// //         const name =
// //             item.NAME
// //             ? sanitizeForUrl(item.NAME).replaceAll("-", "_")
// //             : filenameFallback

// //         const courseFolder = courseShort[item.COURSE]?.toLowerCase()
// //         // @ts-ignore
// //         const studentName = fileDataIO[name] ? name : filenameFallback
// //         const format = 'webp'

// //         return {
// //             front: `/images/${courseFolder}/${studentName}/${studentName}_front.${format}`,
// //             back: `/images/${courseFolder}/${studentName}/${studentName}_back.${format}`,
// //             spine: `/images/${courseFolder}/${studentName}/${studentName}_spine.${format}`,
// //         }
// //     }, [item?.ID]) // 👈 stable key

// //     // 
// //     // const frontUrl = item.book!.front;
// //     // const backUrl = item.book!.back;
// //     // const spineUrl = item.book!.spine;

// //     //
// //     const [width, setWidth]   = useState(0.16);
// //     const [height, setHeight] = useState(0.24);
// //     const [spine, setSpine]   = useState(0.028);

// //     // 
// //     function handleCoverDims({ front, spine }: { front: any; spine: any; }) {

// //          // your chosen physical height
// //         const targetHeight = 0.24 * 1;

// //         // Front cover
// //         const coverWidth = targetHeight * front.aspect;
// //         const spineThickness = targetHeight * spine.aspect;
// //         const totalWidth = coverWidth;

// //         setHeight(targetHeight);
// //         setWidth(totalWidth);
// //         setSpine(spineThickness);
// //     }

// //     // 
// //     return (
// //         <group 
// //         rotation={[0,Math.PI,0]}
// //         onPointerEnter={() => setShowButton(true)}
// //         onPointerLeave={() => setShowButton(false)}
// //         >
// //             <Book
// //             width={width}
// //             height={height}
// //             spine={spine}
// //             frontUrl={bookUrls.front}
// //             backUrl={bookUrls.back}
// //             spineUrl={bookUrls.spine}
// //             onDimensions={handleCoverDims}
// //             />
// //         </group>
// //     );
// // }


// // interface BookProps {
// //     width: number;
// //     height: number;
// //     spine: number;
// //     frontUrl: string;
// //     backUrl: string;
// //     spineUrl: string;
// //     onDimensions: (data : {
// //         front: any;
// //         spine: any
// //     }) => void;
// // }

// // function Book({
// //     width,
// //     height,
// //     spine,
// //     frontUrl,
// //     backUrl,
// //     spineUrl,
// //     onDimensions
// // }: BookProps) {


// //     // Load only when values exist
// //     const [front, back, spineTex, pagesTex, pagesTopText, pagesBottomText] = useTexture(
// //         [
// //             `${frontUrl}`,
// //             `${backUrl}`,
// //             `${spineUrl}`,
// //             `/images/om/_general/pages.jpg`,
// //             `/images/om/_general/pages-top.jpg`,
// //             `/images/om/_general/pages-bottom.jpg`
// //         ].filter(Boolean)
// //     );

// //     useEffect(() => {
// //         // 
// //         if (!front || !front.image) return;

// //         // 
// //         const frontImg = front.image as HTMLImageElement;
// //         const spineImg = spineTex.image as HTMLImageElement;

// //         const dimensions = {
// //             front: {
// //                 w: frontImg.naturalWidth,
// //                 h: frontImg.naturalHeight,
// //                 aspect: frontImg.naturalWidth / frontImg.naturalHeight,
// //             },
// //             spine: {
// //                 w: spineImg.naturalWidth,
// //                 h: spineImg.naturalHeight,
// //                 aspect: spineImg.naturalWidth / spineImg.naturalHeight,
// //             },
// //         }

// //         // 
// //         onDimensions(dimensions);

// //     }, [front, spineTex, onDimensions]);

// //     const materials = useMemo(() => {

// //         // Defining the texture
// //         const m = (map?: THREE.Texture) => ({
// //             map,
// //             roughness: 0.8,
// //             metalness: 0.05,
// //             envMapIntensity: 0.4,
// //         });

// //         // 
// //         return [
// //             m(spineTex),     // Pos 1 === Spine
// //             m(pagesTex),
// //             m(pagesTopText),
// //             m(pagesBottomText),
// //             m(back),  // --> Pos. 4 = Front?
// //             m(front),  // --> Pos. 5 == Front
// //         ];

// //     }, [front, back, spineTex]);

// //     return (
// //         <mesh castShadow receiveShadow scale={[width, height, spine]}>
// //             <boxGeometry 
// //             args={[1, 1, 1]}
// //             // args={[width, height, spine]} 
// //             />
// //             {materials.map((mat, i) => (
// //                 <meshStandardMaterial key={i} attach={`material-${i}`} {...mat} />
// //             ))}
// //         </mesh>
// //     );
// // }



// 'use client'

// import { useEffect, useMemo, useRef, useState } from 'react'
// import { useTexture } from '@react-three/drei'
// import * as THREE from 'three'
// import { courseShort, TypeProject } from '@/types/project-type'
// import { fileDataIO } from '@/data/fileData'
// import { sanitizeForUrl } from '@/util/sanitizeForUrl'

// interface Props {
//   item: TypeProject | null
//   setShowButton: (value: boolean) => void
//   visible: boolean
// }

// export default function SceneBook({ item, setShowButton, visible }: Props) {
//   const groupRef = useRef<THREE.Group>(null!)

//   /* ---------------------------------------------
//    * Visibility control (NO remounting)
//    * --------------------------------------------- */
//   useEffect(() => {
//     if (groupRef.current) {
//       groupRef.current.visible = visible
//     }
//   }, [visible])

//   /* ---------------------------------------------
//    * Derive URLs (immutable, stable)
//    * --------------------------------------------- */
//   const bookUrls = useMemo(() => {
//     if (!item) return null

//     const fallback = 'mona_kerntke'
//     const name = item.NAME
//       ? sanitizeForUrl(item.NAME).replaceAll('-', '_')
//       : fallback

//     const courseFolder = courseShort[item.COURSE]?.toLowerCase()
//     // @ts-ignore
//     const studentName = fileDataIO[name] ? name : fallback
//     const format = 'webp'

//     return {
//       front: `/images/${courseFolder}/${studentName}/${studentName}_front.${format}`,
//       back: `/images/${courseFolder}/${studentName}/${studentName}_back.${format}`,
//       spine: `/images/${courseFolder}/${studentName}/${studentName}_spine.${format}`,
//     }
//   }, [item?.ID])

//   /* ---------------------------------------------
//    * Physical dimensions (scale only)
//    * --------------------------------------------- */
//   const [scale, setScale] = useState<[number, number, number]>([
//     0.16, 0.24, 0.028,
//   ])

//   const handleCoverDims = ({
//     front,
//     spine,
//   }: {
//     front: { aspect: number }
//     spine: { aspect: number }
//   }) => {
//     const targetHeight = 0.24
//     const width = targetHeight * front.aspect
//     const spineThickness = targetHeight * spine.aspect

//     setScale([width, targetHeight, spineThickness])
//   }

//   return (
//     <group
//       ref={groupRef}
//       rotation={[0, Math.PI, 0]}
//       onPointerEnter={() => setShowButton(true)}
//       onPointerLeave={() => setShowButton(false)}
//     >
//       {bookUrls && (
//         <Book
//           scale={scale}
//           urls={bookUrls}
//           onDimensions={handleCoverDims}
//         />
//       )}
//     </group>
//   )
// }

// /* ========================================================= */

// interface BookProps {
//   scale: [number, number, number]
//   urls: {
//     front: string
//     back: string
//     spine: string
//   }
//   onDimensions: (data: {
//     front: { aspect: number }
//     spine: { aspect: number }
//   }) => void
// }

// function Book({ scale, urls, onDimensions }: BookProps) {
//   /* ---------------------------------------------
//    * Textures (stable order, reused)
//    * --------------------------------------------- */
//   const [
//     front,
//     back,
//     spineTex,
//     pages,
//     pagesTop,
//     pagesBottom,
//   ] = useTexture([
//     urls.front,
//     urls.back,
//     urls.spine,
//     '/images/om/_general/pages.jpg',
//     '/images/om/_general/pages-top.jpg',
//     '/images/om/_general/pages-bottom.jpg',
//   ])

//   /* ---------------------------------------------
//    * Extract image ratios ONCE
//    * --------------------------------------------- */
//   useEffect(() => {
//     if (!front?.image || !spineTex?.image) return

//     const frontImg = front.image as HTMLImageElement
//     const spineImg = spineTex.image as HTMLImageElement

//     onDimensions({
//       front: { aspect: frontImg.naturalWidth / frontImg.naturalHeight },
//       spine: { aspect: spineImg.naturalWidth / spineImg.naturalHeight },
//     })
//   }, [front, spineTex, onDimensions])

//   /* ---------------------------------------------
//    * Materials (memoized)
//    * --------------------------------------------- */
//   const materials = useMemo(() => {
//     const m = (map?: THREE.Texture) =>
//       new THREE.MeshStandardMaterial({
//         map,
//         roughness: 0.8,
//         metalness: 0.05,
//         envMapIntensity: 0.4,
//       })

//     return [
//       m(spineTex),
//       m(pages),
//       m(pagesTop),
//       m(pagesBottom),
//       m(back),
//       m(front),
//     ]
//   }, [front, back, spineTex, pages, pagesTop, pagesBottom])

//   return (
//     <mesh castShadow receiveShadow scale={scale}>
//       {/* geometry NEVER changes */}
//       <boxGeometry args={[1, 1, 1]} />
//       {materials.map((mat, i) => (
//         <primitive key={i} object={mat} attach={`material-${i}`} />
//       ))}
//     </mesh>
//   )
// }
