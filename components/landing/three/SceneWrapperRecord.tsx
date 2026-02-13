'use client'

import { Environment, OrbitControls } from "@react-three/drei";
import { CameraProps, Canvas } from "@react-three/fiber"
import { ReactNode } from "react";

import FrameExporter from "./FrameExport";
import { TypeProject } from "@/types/project-type";

interface Prop {
  camSettings: CameraProps;
  children: ReactNode;
//   autoRotateSpeed: number;
  type: "orbit" | "interact";
//   exportFrames?: boolean;
  exportFrames?: number|null;
  totalFrames?: number;
  goNext: () => void;
  currentProject: TypeProject|null
}

const SceneWrapperRecord = ({
    camSettings,
    children,
    // autoRotateSpeed,
    type ,
    exportFrames,
    totalFrames,
    goNext,
    currentProject
}: Prop) => {

    if(exportFrames === null) return <></>

    return (
       <Canvas 
       gl={{
            powerPreference: "high-performance",
            antialias: true,
            preserveDrawingBuffer: true,
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
            {/* {exportFrames && ( */}
            <FrameExporter 
            key={exportFrames}
            totalFrames={totalFrames} 
            goNext={goNext}
            currentProject={currentProject}
            />
            {/* )} */}
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
                // autoRotate
                // autoRotateSpeed={autoRotateSpeed}   // adjust speed
                enableRotate={false}
                enableZoom={false}
                enablePan={false}
                />
            }
            <ambientLight intensity={0.3} />
            {/* <ambientLight intensity={0.9} /> */}
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
            intensity={1}
            position={[-2, 2, 2]}
            lookAt={[0, 0, 0]}
            />
            <rectAreaLight
            width={4}
            height={2}
            intensity={1}
            position={[2, -2, -2]}
            lookAt={[0, 0, 0]}
            />
        </Canvas>
    )
}

export default SceneWrapperRecord