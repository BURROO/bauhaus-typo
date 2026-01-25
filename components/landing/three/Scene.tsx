'use client'

import { CameraProps, Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import ObjModel from './ObjModel'
import VideoPlane from './VideoPlane'
import { TypeProject } from '@/types/project-type'
import { fileDataTT } from '@/data/fileData'



interface Props{
  item: TypeProject;
  rotationSpeed: number;
}

export default function Scene({ item, rotationSpeed }: Props) {

  // const src = `/images/tt/showcase/mai_do_showcase.mp4`

  const filename = item.Studierende.toLowerCase().split(" ").join("_")

  // console.log("filename", filename, fileDataTT[filename]?.showcase)

  // @ts-ignore
  const src = `/images/tt/showcase/${filename}_showcase.webm`
  // const src = fileDataTT[filename]?.showcase || `/images/tt/showcase/phuong_mai_do_showcase.mp4`

  const screensOfst = 0.087

  const orbitCam: CameraProps = {
      zoom: 17,     
      position: [0, 2/1.5, 6/1.5],
      near: 0.1,
      far: 10,
      // position: [0, 1.5/18, 8/18], 
      // fov: 45 
  }

  return (
    // <Canvas camera={{ position: [0, 1.5/10, 4/10], fov: 50 }}>
  //  <Canvas camera={{ position: [0, 1.5/18, 8/18], fov: 50, lookAt: Math.PI*0.3 }} >
   <Canvas camera={orbitCam} >
      {/* <ambientLight intensity={0.5} /> */}
      {/* <ambientLight intensity={0.01} /> */}

      <group>
        <group position={[0,0,screensOfst]}>
          <ObjModel url="/macbook.glb" position={[0,-0.05,0]} rotation={[0,0,0]}/>
          <VideoPlane
          src={src}
          position={[0, 0.04, -0.081]} 
          rotate={[0,0,0]} 
          size={[0.23, 0.135]}
          />
          {/* <VideoPlane
          src={src}
          position={[0, 0.034, -0.1022]} 
          rotate={[-0.265,0,0]} 
          size={[0.23, 0.145]}
          /> */}
        </group>
        <group rotation={[0,Math.PI,0]} position={[0,0,-screensOfst]} >
            <ObjModel url="/macbook.glb" position={[0,-0.05,0]} rotation={[0,0,0]}/>
          <VideoPlane
          src={src}
          position={[0, 0.04, -0.081]} 
          rotate={[0,0,0]} 
          size={[0.23, 0.135]}
          />
        </group>
      </group>


      {/* <ObjModel url="/macbook.glb" position={[0,-0.05,-0.3]} rotation={[0,Math.PI,0]}/> */}

      <Environment
      preset="studio"
      // blur={20} 
      environmentIntensity={0.3}
      />
      {/* <Environment preset="night" /> */}
      <OrbitControls
      makeDefault 
      autoRotate
      autoRotateSpeed={rotationSpeed} 
      enableRotate={false}
      enableZoom={false}
      enablePan={false}
      />
    </Canvas>
  )
}
