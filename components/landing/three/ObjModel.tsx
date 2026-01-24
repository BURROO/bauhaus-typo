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

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh

      // optional: override material
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.4,
        metalness: 0.1,
      })

      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })

  return (
    <primitive
      scale={0.018}
      object={scene}
      position={position}
      rotation={rotation}
      // scale={scale}
    />
  )
}
