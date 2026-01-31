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

    useFrame((state) => {
        const time = state.clock.elapsedTime
        const camera = state.camera

        elements.forEach((g, i) => {
            if (!g) return

            // 1️⃣ Face the camera (full billboard)
            g.lookAt(camera.position)

            // 2️⃣ Roll around screen normal (local Z)
            animation.forEach(item => {
                if (item.attribute === 'rotation') {
                    g.rotation.z =
                        baseRot.current[i].z +
                        time * item.speed +
                        i * item.ofstPerItem
                }
            })
        })
    })

    // useFrame((state) => {
    //     const time = state.clock.elapsedTime
    //     const camera = state.camera

    //     const camDir = new THREE.Vector3()
    //     const up = new THREE.Vector3(0, 1, 0)

    //     elements.forEach((g, i) => {
    //         if (!g) return

    //         // 1️⃣ Direction from object to camera
    //         camDir
    //             .copy(camera.position)
    //             .sub(g.position)
    //             .normalize()

    //         // 2️⃣ Billboard rotation (face camera)
    //         const lookQuat = new THREE.Quaternion().setFromRotationMatrix(
    //             new THREE.Matrix4().lookAt(
    //                 g.position,
    //                 camera.position,
    //                 up
    //             )
    //         )

    //         // 3️⃣ Spin around the view axis
    //         let spin = 0
    //         animation.forEach(item => {
    //             if (item.attribute === 'rotation') {
    //                 spin += time * item.speed + i * item.ofstPerItem
    //             }
    //         })

    //         const spinQuat = new THREE.Quaternion().setFromAxisAngle(
    //             camDir, // 👈 axis facing camera
    //             spin
    //         )

    //         // 4️⃣ Combine
    //         g.quaternion.copy(lookQuat).multiply(spinQuat)
    //     })
    // })
    // useFrame((state, delta) => {
    //     const time = state.clock.elapsedTime
    //     const camera = state.camera

    //     elements.forEach((g, i) => {
    //         if (!g) return

    //         // --- billboard only on Y ---
    //         const dx = camera.position.x - g.position.x
    //         const dz = camera.position.z - g.position.z
    //         g.rotation.y = Math.atan2(dx, dz)

    //         // --- animations ---
    //         animation.forEach(item => {
    //             //   const phase = i * item.ofstPerItem
    //             //   const value = delta * item.speed
    //             const phase = i * item.ofstPerItem
    //             const value = time * item.speed + phase

    //             if (item.attribute === 'rotation') {

    //                 // baseRot.current[i][item.axis] +
    //                 //     time * item.speed +
    //                 //     i * item.ofstPerItem
    //                 g.rotation[item.axis] =
    //                     baseRot.current[i][item.axis] +
    //                     time * item.speed +
    //                     i * item.ofstPerItem
    //             }

    //             if (item.attribute === 'position') {
    //                 g.position[item.axis] += value
    //             }
    //         })
    //     })
    // })

}