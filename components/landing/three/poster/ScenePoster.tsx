import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import SceneWrapper from "../SceneWrapper";
import { CameraProps, useFrame } from "@react-three/fiber";
import { courseShort, TypeProject } from "@/types/project-type";
import { fileDataIO } from "@/data/fileData";
import { sanitizeForUrl } from "@/util/sanitizeForUrl";

interface PosterProps {
    type: 'orbit' | 'interact';
    item: TypeProject;
    folded?: boolean;      // if true, simulate a fold
    rolled?: boolean;      // if true, simulate rolled poster
    autoRotateSpeed: number,
}


export default function ScenePosterWrapper({
  autoRotateSpeed,
  type,
  item
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
  // 
  const camSettings = type === 'orbit' 
      ? orbitCam 
      : interactCam

  return (
    // <SceneWrapper
    // camSettings={camSettings}
    // type={type}
    // autoRotateSpeed={autoRotateSpeed}
    // >
      <ScenePosterInner
      type={type}
      item={item}
      autoRotateSpeed={autoRotateSpeed}
      />
    // </SceneWrapper>
  )
}

function ScenePosterInner({
    folded = false,
    rolled = false,
    item,
}: PosterProps) {
  // Load front textures




  const kurs = courseShort[item.COURSE].toLowerCase()
  const slug = sanitizeForUrl(item.NAME).split("-").join("_");


  // const frontUrls: string[] = useMemo(() => [
  //   `/images/${kurs}/poster/front_l1.webp`,
  //   `/images/${kurs}/poster/front_l2.webp`,
  //   `/images/${kurs}/poster/front_l3.webp`
  // ], []);
  //@ts-ignore
  const frontUrls: string[] = useMemo(() => fileDataIO[slug]?.front.map((l, i) =>  `/images/${kurs}/poster/front_l${i+1}.webp`) || [], [item]);
  //@ts-ignore
  const backUrls: string[] = useMemo(() => fileDataIO[slug]?.back.map((l, i) =>  `/images/${kurs}/poster/back_l${i+1}.webp`) || [], [item]);
  
  const frontTextures = useTexture(frontUrls);
  const backTextures = useTexture(backUrls);

  const width = 1.453*0.1;
  const height = width/21*29.7;

  // useEffect(() => {
  //   onDimensions?.({ width, height });
  // }, [width, height, onDimensions]);

  // Build materials: front layers stacked via alpha
  // const materials = useMemo(() => {
  //   const createLayeredMaterial = (textures: THREE.Texture[]) => {
  //     if (textures.length === 0) return new THREE.MeshStandardMaterial({ color: 0xffffff });
      
  //     // Single texture = simple material
  //     if (textures.length === 1) return new THREE.MeshStandardMaterial({ map: textures[0], side: THREE.DoubleSide });

  //     // Multiple textures = use alpha layering
  //     const baseMat = new THREE.MeshStandardMaterial({
  //       map: textures[0],
  //       transparent: true,
  //       side: THREE.DoubleSide,
  //     });

  //     if (textures.length > 1) {
  //       // Use a second material on the same mesh for simplicity
  //       // (For real parametric stacking, you'd write a custom shader)
  //       const secondMat = new THREE.MeshStandardMaterial({
  //         map: textures[1],
  //         transparent: true,
  //         side: THREE.DoubleSide,
  //       });
  //       return [baseMat, secondMat];
  //     }
  //     return baseMat;
  //   };

  //   const frontMat = createLayeredMaterial(frontTextures);
  //   const backMat = createLayeredMaterial(backTextures);

  //   return Array.isArray(frontMat)
  //     ? [...frontMat, ...(Array.isArray(backMat) ? backMat : [backMat])]
  //     : [frontMat, ...(Array.isArray(backMat) ? backMat : [backMat])];
  // }, [frontTextures, backTextures]);

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
        1 + i * 0.2,
        1 + i * 0.2
      ),
    });
  });
}, [frontTextures]);

  if(item.COURSE === "Bauhaus Master Lectures") rolled = true



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
          position={[0, 0, i * 0.002]} // tiny depth separation
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


const hash = (x: number, y: number) =>
  Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;