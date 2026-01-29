'use client'

import { useEffect, useMemo, useState } from "react";
import { CameraProps } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { courseShort, TypeProject } from "@/types/project-type";
import  * as THREE from 'three'
import { fileDataIO } from "@/data/fileData";
import { sanitizeForUrl } from "@/util/sanitizeForUrl";
import SceneWrapper from "../SceneWrapper";

interface Props{
    item: TypeProject;
    type: 'orbit' | 'interact';
    setShowButton: (value: boolean) => void;
    autoRotateSpeed?: number;
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
            `/images/om/_general/pages.jpg`,
            `/images/om/_general/pages-top.jpg`,
            `/images/om/_general/pages-bottom.jpg`
        ].filter(Boolean)
    );

    useEffect(() => {
        // 
        if (!front || !front.image) return;

        // 
        const frontImg = front.image as HTMLImageElement;
        const spineImg = spineTex.image as HTMLImageElement;

        const dimensions = {
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
        }

        // 
        onDimensions(dimensions);

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

export default function SceneBook({ item, type = "interact",  setShowButton, autoRotateSpeed = 1 }: Props) {

    // 
    const filenameFallback = 'mona_kerntke'
    // 
    const name = item.NAME && sanitizeForUrl(item.NAME).split("-").join("_") || filenameFallback 
    // 
    const courseFolder = courseShort[item.COURSE]?.toLocaleLowerCase()

    // @ts-ignore
    // const data = fileDataIO[name] || fileDataIO["mona_kerntke"]

    // @ts-ignore
    const foundData = !!fileDataIO[name]

    const studentName = foundData ? name : "mona_kerntke"
    // const data = fileDataIO[name]

    // const fileFormat = 'jpg'
    const fileFormat = 'webp'

    // 
    item["book"] = {
        front: `/images/${courseFolder}/${studentName}/${studentName}_front.${fileFormat}`,
        back: `/images/${courseFolder}/${studentName}/${studentName}_back.${fileFormat}`,
        spine: `/images/${courseFolder}/${studentName}/${studentName}_spine.${fileFormat}`,
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
        const targetHeight = 0.24 * 1;

        // Front cover
        const coverWidth = targetHeight * front.aspect;
        const spineThickness = targetHeight * spine.aspect;
        const totalWidth = coverWidth;

        setHeight(targetHeight);
        setWidth(totalWidth);
        setSpine(spineThickness);
    }

    // 
    const orbitCam: CameraProps = {
        zoom: 17,          // higher = closer
        // position: [0, 0.4, 0.6],
        position: [0, 2, 6],
        near: 0.1,
        far: 10,
    }

    // 
    const interactCam: CameraProps = {
        position: [0.02, 0.4, 0.6], 
        fov: 45 
    }

    // 
    return (
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
    );
}
