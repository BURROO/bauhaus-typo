'use client'

import { Environment, OrbitControls } from "@react-three/drei";
import { CameraProps, Canvas } from "@react-three/fiber"
import { ReactNode } from "react";

interface Prop {
    camSettings: CameraProps;
    children: ReactNode;
    autoRotateSpeed: number;
    type: "orbit" | "interact"
}

const SceneWrapper = ({
    camSettings,
    children,
    autoRotateSpeed,
    type 
}: Prop) => {

    return (
       <Canvas 
       gl={{
            powerPreference: "high-performance",
            antialias: true,
            preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
            gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
                e.preventDefault();
                console.warn("WebGL context lost");
            },
            false
            );
            gl.domElement.addEventListener(
            "webglcontextrestored",
            () => {
                console.warn("WebGL context restored");
            },
            false
            );
        }}
        camera={camSettings} 
        style={{ width: "100%", height: "100%" }}
        >
            {/*  */}
            {children}
            {/* <Environment
            preset="studio"
            // environmentIntensity={0.03}
            environmentIntensity={0.3}
            /> */}
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
                autoRotateSpeed={autoRotateSpeed}   // adjust speed
                enableRotate={false}
                enableZoom={false}
                enablePan={false}
                />
            }
            <ambientLight intensity={0.3} />
            <directionalLight
            position={[3, 5, 4]}
            intensity={1.2}
            castShadow
            />
            <directionalLight
            position={[-3, 5, -4]}
            intensity={1.2}
            castShadow
            />
            {/*  */}
            <rectAreaLight
            width={4}
            height={2}
            intensity={3}
            position={[-2, 1, 2]}
            lookAt={[0, 0, 0]}
            />
            <rectAreaLight
            width={4}
            height={2}
            intensity={3}
            position={[2, 1, -2]}
            lookAt={[0, 0, 0]}
            />
        </Canvas>
    )
}

export default SceneWrapper