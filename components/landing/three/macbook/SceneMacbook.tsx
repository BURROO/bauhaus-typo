'use client'

import { CameraProps } from '@react-three/fiber'
import ObjModel from './ObjModel'
import VideoPlane from '../VideoPlane'
import { TypeProject } from '@/types/project-type'
import  * as THREE from 'three'
import { getUrlVideo } from '@/util/sanitizeForUrl'
import SceneWrapper from '../SceneWrapper'



interface Props{
  item: TypeProject;
  rotationSpeed: number;
  type: 'orbit' | 'interact';
}

export default function SceneMacbook({ item, rotationSpeed, type }: Props) {

  // const src = `/images/tt/showcase/mai_do_showcase.mp4`

  // const filename = item.NAME.toLowerCase().split(" ").join("_")

  // @ts-ignore
  // const src = `/images/tt/showcase/${filename}_showcase.webm`
  const src = getUrlVideo(item)
  // const src = fileDataTT[filename]?.showcase || `/images/tt/showcase/phuong_mai_do_showcase.mp4`


  const screensOfst = 0.087



  const interactCam: CameraProps = {
      position: [0.02, 0.4, 0.6], 
      fov: 45 
  }


  return (
      <group>
    
          <ModelWithScreen position={[0,0,screensOfst]} src={src} />
        {
          type === "orbit" && (
            <ModelWithScreen position={[0,0,-screensOfst]} rotation={[0,Math.PI,0]}  src={src} />
          )
        }
      </group>
    
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