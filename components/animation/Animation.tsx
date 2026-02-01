'use client'

import { CameraProps } from '@react-three/fiber'
import ScreenWrapper from '../../components/landing/three/SceneWrapper'
import { courseShort, TypeProject } from '@/types/project-type'
import AnimationWebsite from './AnimationWebsite'
import { TypeAnimation } from '../hook/useAnimation'
import { useState } from 'react'
import AnimationBook from './AnimationBook'
import AnimationSettings from './AnimationSettings'


interface Props{
    data: TypeProject[]
}

const Animation = ({ 
    data
 }: Props) => {


  const orbitCam: CameraProps = {
    zoom: 17,
    position: [0, 2, 6],
    near: 0.1,
    far: 10,
  }

    const [animation, setAnimation] = useState<TypeAnimation[]>([
        {
            attribute: `rotation`,
            axis: `x`,
            ofstPerItem: 0.2,
            speed: 2
        },
        {
            attribute: `rotation`,
            axis: `y`,
            ofstPerItem: 0.2,
            speed: 2
        }
    ])

    const [selectedCourse, setSelectedCourse] = useState<'TT'|'OM'|'PZ'|'TG'>('PZ')
    const [showSettings, setShowSettings] = useState(true)
    const [radius, setRadius] = useState(0.35)
    const [scale, setScale] = useState(1)
    const [background, setBackground] = useState("black")


  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: background,
      }}
    >
        <ScreenWrapper autoRotateSpeed={3} type="orbit" camSettings={orbitCam}>
            <group key={selectedCourse} scale={scale}>
                {selectedCourse === 'TT' && <AnimationWebsite key={selectedCourse} radius={radius} data={data.filter((d) => d.COURSE === 'Transcoding Typography')} animation={animation} />}
                {selectedCourse === 'OM' && <AnimationBook key={selectedCourse} radius={radius} data={data.filter((d) => d.COURSE === 'In Order Of Meaning ')} animation={animation} />}
                {selectedCourse === 'PZ' && <AnimationWebsite key={selectedCourse} radius={radius} data={data.filter((d) => d.COURSE === 'Handmade Websites as Punk Zines')} animation={animation} />}
            </group>
        </ScreenWrapper>

        <AnimationSettings
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        background={background}
        setBackground={setBackground}
        radius={radius}
        setRadius={setRadius}
        scale={scale}
        setScale={setScale}
        animation={animation}
        setAnimation={setAnimation}
        />
    </div>
  )
}

export default Animation
