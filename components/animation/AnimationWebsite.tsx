import { TypeProject } from "@/types/project-type"
import * as THREE from 'three'
import { useEffect, useRef } from "react"
import SceneBook from "../landing/three/book/SceneBook"
import { TypeAnimation, useAnimation } from "../hook/useAnimation"
import SceneMacbook from "../landing/three/macbook/SceneMacbook"

const AnimationWebsite = ({ data, animation, radius }: { data: TypeProject[], animation: TypeAnimation[]; radius: number }) => {


    console.log("data", data)
    const groupRefs = useRef<THREE.Group[]>([])
    // const groupRefs = useRef<Record<string, THREE.Group>>({})

    useEffect(() => {
        groupRefs.current = []
    }, [data]) // or [OM]
    // useEffect(() => {
    //     groupRefs.current = {}
    // }, [data])

    useAnimation({ 
        elements: groupRefs.current,
        // elements: Object.values(groupRefs.current),
        animation 
    })

    return (
        <>
        {data.map((d, i) => {
            const count = data.length
            const angle = (i / count) * Math.PI * 2
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            return (
            <group
                // key={d.ID}
                // ref={(el) => {
                //     if (el) groupRefs.current[d.ID] = el
                //     else delete groupRefs.current[d.ID]
                // }}
  
                position={[x, 0, z]}
                rotation={[0,0,Math.PI]}
                scale={0.65}
                key={i}
                ref={(el) => (groupRefs.current[i] = el!)}
            >
                <group rotation={[0.1, 0.2, Math.PI/2]}>
                    <SceneMacbook
                    visible={true}
                    // setShowButton={() => {}}
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