'use client'

import { useLoader } from '@react-three/fiber'
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'

type Props = {
  url: string
}

export default function ObjModel({ url }: Props) {
  const obj = useLoader(OBJLoader, url)

  obj.traverse((child: any) => {
    if ((child as THREE.Mesh).isMesh) {
      ;(child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.4,
        metalness: 0.1,
      })
    }
  })

  return <primitive object={obj} scale={0.018} position={[0,-0.05,0]}/>
}
