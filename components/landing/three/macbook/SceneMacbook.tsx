'use client'

import { useEffect, useMemo, useRef, forwardRef } from 'react'
import * as THREE from 'three'
import ObjModel from './ObjModel'
import VideoPlane from '../VideoPlane'
import { TypeProject } from '@/types/project-type'
import { useHover } from '@/components/hook/useHover'
import { getAssetShowcase } from '@/util/getAssets'


interface Props {
  item: TypeProject | null;
  type: 'orbit' | 'interact';
  isDouble: boolean;
  visible: boolean;
  onClick: () => void;
}

export default function SceneMacbook({
  item,
  type,
  isDouble,
  visible,
  onClick
}: Props) {
  const rootRef = useRef<THREE.Group>(null!)
  const frontRef = useRef<THREE.Group>(null!)
  const backRef = useRef<THREE.Group>(null!)

  /* ---------------------------------------------
   * Visibility (no remount)
   * --------------------------------------------- */
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.visible = visible
    }
  }, [visible])

  /* ---------------------------------------------
   * Video source (stable)
   * --------------------------------------------- */
  const src = useMemo(() => {
    if (!item) return null
    return getAssetShowcase({item})
  }, [item?.ID])

  /* ---------------------------------------------
   * Double screen toggle
   * --------------------------------------------- */
  useEffect(() => {
    if (backRef.current) {
      backRef.current.visible = type === 'orbit' && isDouble
    }
  }, [type, isDouble])


  const { setCursor } = useHover()

  const screensOfst = 0.087

  return (
    <group ref={rootRef}
    onPointerDown={onClick}
    onPointerEnter={() => setCursor("pointer")}
    onPointerLeave={() => setCursor("auto")}
    >
      {/* FRONT */}
      <MacbookInstance
        ref={frontRef}
        position={[0, 0, screensOfst]}
        src={src}
      />

      {/* BACK (always mounted) */}
      <MacbookInstance
        ref={backRef}
        position={[0, 0, -screensOfst]}
        rotation={[0, Math.PI, 0]}
        src={src}
      />
    </group>
  )
}

/* ========================================================= */

interface MacbookInstanceProps {
  src: string | null
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const MacbookInstance = forwardRef<THREE.Group, MacbookInstanceProps>(
  ({ src, position, rotation }, ref) => {
    return (
      <group ref={ref} position={position} rotation={rotation}>
        {/* Geometry NEVER recreated */}
        <ObjModel url="/macbook.glb" position={[0, -0.05, 0]} />

        {/* Video only updates source */}
        {src && <VideoPlane
          src={src}
          position={[0, 0.04, -0.081]}
          rotate={[0, 0, 0]}
          size={[0.23, 0.135]}
        />}
      </group>
    )
  }
)

MacbookInstance.displayName = 'MacbookInstance'

