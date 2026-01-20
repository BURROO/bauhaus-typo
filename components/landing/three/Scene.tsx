'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import ObjModel from './ObjModel'
import VideoPlane from './VideoPlane'

export default function Scene() {
  return (
    // <Canvas camera={{ position: [0, 1.5/10, 4/10], fov: 50 }}>
   <Canvas camera={{ position: [0, 1.5/18, 8/18], fov: 50 }}>
      <ambientLight intensity={0.5} />
      {/* <directionalLight position={[5, 5, 5]} intensity={1} /> */}

      <ObjModel url="/macbook.obj"/>
      <VideoPlane src="/video.mp4" position={[0, 1, -1.5]} />
      <VideoPlane src="/video.mp4" position={[0, 1.5/18, 8/18]} />

      <Environment preset="studio" />
      {/* <OrbitControls enableZoom={false} /> */}
                <OrbitControls
                makeDefault 
                autoRotate
                autoRotateSpeed={20}   // adjust speed
                enableRotate={false}
                enableZoom={false}
                enablePan={false}
                />
    </Canvas>
  )
}
