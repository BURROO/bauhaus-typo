import {  useMemo, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { CameraProps, useFrame } from "@react-three/fiber";
import { courseShort, TypeProject } from "@/types/project-type";
import { fileDataIO } from "@/data/fileData";
import { sanitizeForUrl } from "@/util/sanitizeForUrl";
import { useHover } from "@/components/hook/useHover";

interface PosterProps {
    type: 'orbit' | 'interact';
    item: TypeProject|null;
    onClick: () => void;
    folded?: boolean;      // if true, simulate a fold
    rolled?: boolean;      // if true, simulate rolled poster
}


export default function ScenePosterWrapper({
  type,
  item,
  onClick
}: PosterProps){

    // 
  const orbitCam: CameraProps = {
      // position: [0, 0.4, 0.6],
    position: [0, 2, 6],
    near: 0.1,
    far: 10,
  }
  // 
  const interactCam: CameraProps = {
    // position: [0.02, 3, 0.6], 
    position: [0, 2, 10],
    // position: [0.002, 0.04, 0.06], 
    fov: 45 
  }
  // // 
  // const camSettings = type === 'orbit' 
  //     ? orbitCam 
  //     : interactCam

  const { setCursor } = useHover()

  if(!item) return null

  return (
    <group
    onPointerDown={onClick}
    onPointerOver={(e) => {
      e.stopPropagation()
      setCursor('pointer')
    }}
    onPointerOut={(e) => {
      e.stopPropagation()
      setCursor('auto')
    }}
    
    >
      <ScenePosterInner
      type={type}
      item={item}
      />
      </group>
  )
}


interface PosterInnerProps {
    type: 'orbit' | 'interact';
    item: TypeProject;
    folded?: boolean;      // if true, simulate a fold
    rolled?: boolean;      // if true, simulate rolled poster
}

function ScenePosterInner({
    folded = false,
    rolled = false,
    item,
}: PosterInnerProps) {
  // Load front textures


  const kurs = courseShort[item.COURSE].toLowerCase()
  const slug = sanitizeForUrl(item.NAME).split("-").join("_");


  //@ts-ignore
  const frontSettings = fileDataIO[slug]?.front || []
  //@ts-ignore
  const backSettings = fileDataIO[slug]?.back || []

  const frontUrls: string[] = useMemo(() => frontSettings.map((l: any, i: number) =>  `/images/${kurs}/poster/front_l${i+1}.webp`) || [], [item]);
  const backUrls: string[] = useMemo(() => backSettings.map((l: any, i: number) =>  `/images/${kurs}/poster/back_l${i+1}.webp`) || [], [item]);
  
  const frontTextures = useTexture(frontUrls);
  const backTextures = useTexture(backUrls);

  const width = 1.453*0.1;
  const height = width/21*29.7;

  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;
    // update phase = time.current
  });

  const layerMaterials = useMemo(() => {
    return frontTextures.map((txt, i) => {
      return new THREE.MeshPhysicalMaterial({
        map: txt,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.6 - i * 0.15,   // top layer glossier
        metalness: 0.05 + i * 0.02,
        clearcoat: i === 0 ? 0.1 : 0,
        clearcoatRoughness: 0.2,

        normalScale: new THREE.Vector2(
          // 1 + i * 0.2,
          // 1 + i * 0.2
          (i+1) * 0.02,
          (i+1) * 0.02
        ),
      });
    });
}, [frontTextures]);

  if(item?.COURSE === "Bauhaus Master Lectures") rolled = true



  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, 32, 32);

    return geo
  },[item, width, height])

  // const geometry = useMemo(() => {
  //   const ge   = new THREE.PlaneGeometry(width, height, 32, 32);

  //   if (folded) {
  //     // Simple sinusoidal fold along width
  //     for (let i = 0; i < geo.attributes.position.count; i++) {
  //       const x = geo.attributes.position.getX(i);
  //       const y = geo.attributes.position.getY(i);
  //       const fold = Math.sin((x / width) * Math.PI * 2) * 0.05; // fold amplitude
  //       geo.attributes.position.setZ(i, fold);
  //     }
  //     geo.computeVertexNormals();
  //   }

  //   if (rolled) {
  //     // Roll along width
  //     for (let i = 0; i < geo.attributes.position.count; i++) {

  //       const pos = geo.attributes.position;
  //       const halfW = width / 2;

  //       const amplitude = 0.15;     // wave height
  //       const frequency = 2.5;      // number of waves across width
  //       const phase =time.current;            // animate later 👀

  //       for (let i = 0; i < pos.count; i++) {
  //         const x = pos.getX(i);
  //         const y = pos.getY(i);

  //         const nx = x / halfW; // -1 → +1

  //         const z =
  //           Math.sin(nx * Math.PI * frequency + phase) *
  //           amplitude *
  //           Math.cos((y / height) * Math.PI * 0.5); // damp near top/bottom

  //         pos.setZ(i, z);
  //       }
  //     }
  //     geo.computeVertexNormals();
  //   }

  //   return geo;
  // }, [width, height, folded, rolled]);

  useFrame((_, delta) => {
    time.current += delta;

    if(rolled){

      const pos = geometry.attributes.position;
      const halfW = width / 2;
      const halfH = height / 2;

      const amplitude = 0.018;
      // const frequency = 2.2;
      const frequency = 1.2;
      const phase = time.current * 1.2;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        // normalize
        const nx = x / halfW;
        const ny = y / halfH;

        // 👉 diagonal wave
        const diag = nx * 0.3 + ny * 0.6;
        // const noise =
        //   (hash(nx * 10 + phase * 1, ny * 10) - 0.5) * 0.01;

        // const z =
        //   Math.sin(diag * Math.PI * frequency + phase) *
        //   amplitude *
        //   Math.cos(ny * Math.PI * 0.5) +
        //   noise;
        const z =
          Math.sin(diag * Math.PI * frequency + phase) *
          amplitude *
          Math.cos(ny * Math.PI * 0.5); // edge damping

        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
    geometry.computeVertexNormals();
  });

   
if (!frontTextures[0]) return null;
          
  return (
    <group>
      {layerMaterials.map((mat, i) => (
        <mesh
          key={i}
          geometry={geometry}
          position={[0, 0, i * 0.0002]} // tiny depth separation
          // rotation={[0, Math.PI, 0]}
          castShadow
          receiveShadow
        >
          <primitive attach="material" object={mat} />
        </mesh>
      ))}
    </group>
  );
}

