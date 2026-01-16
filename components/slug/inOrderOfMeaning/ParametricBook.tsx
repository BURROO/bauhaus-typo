'use client'

import { useEffect, useMemo, useState } from "react";
import { CameraProps, Canvas } from "@react-three/fiber";
import { useTexture, Environment, OrbitControls } from "@react-three/drei";
import { TypeProject } from "@/types/project-type";
import styles from './ParametricBook.module.css'
import  * as THREE from 'three'

interface Props{
    item: TypeProject;
    onClick: () => void;
    type: 'orbit' | 'interact'
}

interface BookProps {
    width: number;
    height: number;
    spine: number;
    frontUrl: string;
    backUrl: string;
    spineUrl: string;
    onDimensions: (data : {
        front: any;
        spine: any
    }) => void;
}

function Book({
    width,
    height,
    spine,
    frontUrl,
    backUrl,
    spineUrl,
    onDimensions
}: BookProps) {

    // Load only when values exist
    const [front, back, spineTex, pagesTex, pagesTopText, pagesBottomText] = useTexture(
        [
            `${frontUrl}`,
            `${backUrl}`,
            `${spineUrl}`,
            `/images/ioom/_general/pages.jpg`,
            `/images/ioom/_general/pages-top.jpg`,
            `/images/ioom/_general/pages-bottom.jpg`
        ].filter(Boolean)
    );

    useEffect(() => {
        // 
        if (!front || !front.image) return;

        // 
        const frontImg = front.image as HTMLImageElement;
        const spineImg = spineTex.image as HTMLImageElement;

        // 
        onDimensions({
            front: {
                w: frontImg.naturalWidth,
                h: frontImg.naturalHeight,
                aspect: frontImg.naturalWidth / frontImg.naturalHeight,
            },
            spine: {
                w: spineImg.naturalWidth,
                h: spineImg.naturalHeight,
                aspect: spineImg.naturalWidth / spineImg.naturalHeight,
            },
        });

    }, [front, spineTex, onDimensions]);

    const materials = useMemo(() => {

        // Defining the texture
        const m = (map?: THREE.Texture) => ({
            map,
            roughness: 0.8,
            metalness: 0.05,
            envMapIntensity: 0.4,
        });

        // 
        return [
            m(spineTex),     // Pos 1 === Spine
            m(pagesTex),
            m(pagesTopText),
            m(pagesBottomText),
            m(back),  // --> Pos. 4 = Front?
            m(front),  // --> Pos. 5 == Front
        ];

    }, [front, back, spineTex]);

    return (
        <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, spine]} />
            {materials.map((mat, i) => (
                <meshStandardMaterial key={i} attach={`material-${i}`} {...mat} />
            ))}
        </mesh>
    );
}

export default function ParametricBook({ item, onClick, type = "interact" }: Props) {

    // 
    // const filename = item.Studierende.toLowerCase().split(" ").join("_")
    const filename = 'mona_kerntke'

    // 
    item["book"] = {
        front: `/images/ioom/cover/${filename}_front.jpg`,
        back: `/images/ioom/cover/${filename}_back.jpg`,
        spine: `/images/ioom/cover/${filename}_spine.jpg`,
    }

    // 
    const frontUrl = item.book!.front;
    const backUrl = item.book!.back;
    const spineUrl = item.book!.spine;

    //
    const [width, setWidth]   = useState(0.16);
    const [height, setHeight] = useState(0.24);
    const [spine, setSpine]   = useState(0.028);

    // 
    function handleCoverDims({ front, spine }: { front: any; spine: any; }) {

         // your chosen physical height
        const targetHeight = 0.24 * 2;

        // Front cover
        const coverWidth = targetHeight * front.aspect;
        const spineThickness = targetHeight * spine.aspect;
        const totalWidth = coverWidth;

        setHeight(targetHeight);
        setWidth(totalWidth);
        setSpine(spineThickness);
    }

    // 
    const [showButton, setShowButton] = useState(false)

    // 
    const orbitCam: CameraProps = {
        zoom: 15,          // higher = closer
        // position: [0, 0.4, 0.6],
        position: [0, 4, 6],
        near: 0.1,
        far: 10,
    }

    // 
    const interactCam: CameraProps = {
        position: [0.02, 0.4, 0.6], 
        fov: 45 
    }

    // 
    const camSettings = type === 'orbit' 
        ? orbitCam 
        : interactCam

    // 
    return (
        <>
            {
                showButton && 
                <button 
                onMouseOver={() => setShowButton(true)}
                onClick={onClick}
                className={styles.button}
                >
                    Look inside
                </button>
            }
            <Canvas
            // shadows
            camera={camSettings}
            // camera={{ position: [0.02, 0.4, 0.6], fov: 80 }}
            style={{ height: "100%" }}
            >
                <group 
                onPointerEnter={() => setShowButton(true)}
                onPointerLeave={() => setShowButton(false)}
                >
                    <Book
                    width={width}
                    height={height}
                    spine={spine}
                    frontUrl={frontUrl}
                    backUrl={backUrl}
                    spineUrl={spineUrl}
                    onDimensions={handleCoverDims}
                    />
                </group>

                <mesh
                    receiveShadow
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -height / 2 - 0.002, 0]}
                >
                    <planeGeometry args={[2, 2]} />
                    <shadowMaterial opacity={0.25} />
                </mesh>

                {/*  */}
                <Environment preset="studio" environmentIntensity={0.16} />

                {/* rotation + zoom controls */}
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
                    autoRotateSpeed={20}   // adjust speed
                    enableRotate={false}
                    enableZoom={false}
                    enablePan={false}
                    />
                }
            </Canvas>
        </>
    );
}
