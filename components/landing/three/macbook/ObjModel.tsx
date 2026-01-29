// 'use client'

// import { useLoader } from '@react-three/fiber'
// // @ts-ignore
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import * as THREE from 'three'

// type Props = {
//   url: string;
//   position: [number, number, number];
//   rotation: [number, number, number]
// }

// export default function ObjModel({ url, position, rotation }: Props) {
//   const obj = useLoader(OBJLoader, url)

//   obj.traverse((child: any) => {
//     if ((child as THREE.Mesh).isMesh) {
//       ;(child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
//         color: '#ffffff',
//         roughness: 0.4,
//         metalness: 0.1,
//       })
//     }
//   })

//   return (
//       <primitive object={obj} scale={0.018} position={position} rotation={rotation}/>
//     )
// }


'use client'

import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

type Props = {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  // scale?: number
}

export default function GltfModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  // scale = 1,
}: Props) {
  const { scene } = useGLTF(url)


  // 🔑 CLONE the scene
  const clonedScene = useMemo(() => {
    return scene.clone(true)
  }, [scene])

  // Optional: fix materials per instance
  clonedScene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  clonedScene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh

      // optional: override material
      mesh.material = new THREE.MeshStandardMaterial({
        // color: '#1f1f1f',
        color: '#363636',
        // roughness: 0.4,
        // metalness: 0.1,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide
      })

      // mesh.material.side = THREE.DoubleSide

      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })

  return (
    <primitive
      scale={0.018}
      object={clonedScene}
      position={position}
      rotation={rotation}
      // scale={scale}
    />
  )
}
