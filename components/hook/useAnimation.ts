import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import * as THREE from 'three'

export interface TypeAnimation { 
        attribute: 'rotation' | 'position',
        axis: 'x' | 'y' | 'z',
        ofstPerItem: number;
        speed: number;
    }

export interface AnimationProps{
    elements: THREE.Group[];
    animation: TypeAnimation[]
}

export const useAnimation = ({ 
    elements,
    animation
 }: AnimationProps) => {


    // const camera = state.camera
    // elements.forEach((g, i) => {
    //     if (g){
    //         g.lookAt(camera.position)
            
    //     }
    // })
    const baseRot = useRef<THREE.Euler[]>([])

    useEffect(() => {
        elements.forEach((g, i) => {
            baseRot.current[i] = g.rotation.clone()
        })
    }, [elements, animation])

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime
        const camera = state.camera

        elements.forEach((g, i) => {
            if (!g) return

            // --- billboard only on Y ---
            const dx = camera.position.x - g.position.x
            const dz = camera.position.z - g.position.z
            g.rotation.y = Math.atan2(dx, dz)

            // --- animations ---
            animation.forEach(item => {
                //   const phase = i * item.ofstPerItem
                //   const value = delta * item.speed
                const phase = i * item.ofstPerItem
                const value = time * item.speed + phase

                if (item.attribute === 'rotation') {

                    // baseRot.current[i][item.axis] +
                    //     time * item.speed +
                    //     i * item.ofstPerItem
                    g.rotation[item.axis] =
                        baseRot.current[i][item.axis] +
                        time * item.speed +
                        i * item.ofstPerItem
                }

                if (item.attribute === 'position') {
                    g.position[item.axis] += value
                }
            })
        })
    })

}