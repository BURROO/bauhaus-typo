'use client'

import { CameraProps, Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import ObjModel from './ObjModel'
import VideoPlane from './VideoPlane'
import { TypeProject } from '@/types/project-type'
import { fileDataTT } from '@/data/fileData'
import { getUrlVideo } from '@/util/sanitizeForUrl'
import { checkIfAssetExists } from '@/util/checkIfAssetExists'



interface Props{
  item: TypeProject;
  rotationSpeed: number;
  type: 'orbit' | 'interact';
}

export default function Scene({ item, rotationSpeed, type }: Props) {

  // const src = `/images/tt/showcase/mai_do_showcase.mp4`

  const filename = item.NAME.toLowerCase().split(" ").join("_")

  // console.log("filename", filename, fileDataTT[filename]?.showcase)

  // @ts-ignore
  // const src = `/images/tt/showcase/${filename}_showcase.webm`
  const src = getUrlVideo(item)
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

  const interactCam: CameraProps = {
      position: [0.02, 0.4, 0.6], 
      fov: 45 
  }

  const camSettings = type === 'orbit' 
      ? orbitCam 
      : interactCam

  return (
    // <Canvas camera={{ position: [0, 1.5/10, 4/10], fov: 50 }}>
  //  <Canvas camera={{ position: [0, 1.5/18, 8/18], fov: 50, lookAt: Math.PI*0.3 }} >
   <Canvas camera={camSettings} >
      <group>
    
          <ModelWithScreen position={[0,0,screensOfst]} src={src} />
        {
          type === "orbit" && (
            <ModelWithScreen position={[0,0,-screensOfst]} rotation={[0,Math.PI,0]}  src={src} />
          )
        }
      </group>


      {/* <ObjModel url="/macbook.glb" position={[0,-0.05,-0.3]} rotation={[0,Math.PI,0]}/> */}

      <Environment
      preset="studio"
      // blur={20} 
      environmentIntensity={0.3}
      />
      {/* <Environment preset="night" /> */}
      {type === 'interact' ?
        <OrbitControls
        makeDefault
        // enablePan
        enableZoom={false}
        enableRotate
        />
        :
        <OrbitControls
        makeDefault 
        autoRotate
        autoRotateSpeed={rotationSpeed} 
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        />
      }
    </Canvas>
  )
}



const ModelWithScreen = ({ src, position, rotation }: { src: string; position?: [number,number,number]; rotation?: [number,number,number]; }) => {


  return (
    <group position={position} rotation={rotation}>
      <ObjModel url="/macbook.glb" position={[0,-0.05,0]} rotation={[0,0,0]}/>
      <VideoPlane
      src={src}
      position={[0, 0.04, -0.081]} 
      rotate={[0,0,0]} 
      size={[0.23, 0.135]}
      />
    </group>
  )
}