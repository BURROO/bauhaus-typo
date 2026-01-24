'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import ObjModel from './ObjModel'
import VideoPlane from './VideoPlane'
import { TypeProject } from '@/types/project-type'



interface Props{
  item: TypeProject;
}

export default function Scene({ item }: Props) {


  const src = `/images/tt/showcase/mai_do_showcase.mp4`


  return (
    // <Canvas camera={{ position: [0, 1.5/10, 4/10], fov: 50 }}>
   <Canvas camera={{ position: [0, 1.5/18, 8/18], fov: 50 }} >
      <ambientLight intensity={0.5} />

      <ObjModel url="/macbook.glb" position={[0,-0.05,0]} rotation={[0,0,0]}/>
      <VideoPlane
      src={src}
      position={[0, 0.03, -0.099]} 
      rotate={[-0.27,0,0]} 
      size={[0.23, 0.145]}
      />

      <Environment preset="studio" />
      <OrbitControls
      makeDefault 
      autoRotate
      autoRotateSpeed={6} 
      enableRotate={false}
      enableZoom={false}
      enablePan={false}
      />
    </Canvas>
  )
}
