import { TypeProject } from "@/types/project-type"
import * as THREE from 'three'
import { useEffect, useRef } from "react"
import { TypeAnimation, useAnimation } from "../hook/useAnimation"
import SceneMacbook from "../landing/three/macbook/SceneMacbook"

interface Props { 
    data: TypeProject[], 
    animation: TypeAnimation[]; 
    radius: number 
}

const AnimationWebsite = ({ data, animation, radius }: Props) => {

    const groupRefs = useRef<THREE.Group[]>([])

    useEffect(() => {
        groupRefs.current = []
    }, [data]) 

    useAnimation({ 
        elements: groupRefs.current,
        animation 
    })

    return (
        <>
        {data.map((d, i) => {
            const count = data.length
            const angle = (i / count) * Math.PI * 2
            const x = Math.cos(angle) * radius
            // const y = Math.cos(angle) * radius
            const y = 0
            const z = Math.sin(angle) * radius

            // const scale = Math.sin(angle)

            return (
            <group
            position={[x, y, z]}
            // rotation={[0,0,Math.PI]}
            // scale={0.65}
            scale={0.65}
            key={i}
            ref={(el) => (groupRefs.current[i] = el!)}
            >
                <group rotation={[0.1, 0.2, Math.PI/2]}>
                    <SceneMacbook
                    onClick={() => {}}
                    visible={true}
                    item={d} 
                    isDouble={false}
                    type="orbit"
                    />
                </group>
            </group>
            )
        })}
        </>
    )
}

export default AnimationWebsite