import {  useContext, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { courseShort, TypeProject } from "@/types/project-type";
import { fileDataIO } from "@/data/fileData";
import { sanitizeForUrl } from "@/util/sanitizeForUrl";
import { useHover } from "@/components/hook/useHover";
import { ContextMenu } from "@/components/context/ContextMenu";

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

  const { setIsHovered } = useContext(ContextMenu)
  const { setCursor } = useHover()

  if(!item) return null

  return (
    <group
    onPointerDown={onClick}
    onPointerOver={(e) => {
      e.stopPropagation()
      setCursor('pointer')
      setIsHovered(true)
    }}
    onPointerOut={(e) => {
      e.stopPropagation()
      setCursor('auto')
      setIsHovered(false)
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
}

function ScenePosterInner({
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


  const isMetallic = item.COURSE === "Bauhaus Master Lectures" || item.COURSE === "Bauhaus Inhouse"


  const metallness = (isMetallic: boolean, index: number) => {
    
    if(isMetallic){
      return {
        roughness: 0.6 - index * 0.15,   // top layer glossier
        metalness: 0.05 + index * 0.02,
        clearcoat: index === 0 ? 0.1 : 0,
        clearcoatRoughness: 0.2,
        transparent: true,
      }
    }else{
      return {
        roughness: 1,
        metalness: 0,
        clearcoat: 0,
        clearcoatRoughness: 0,
        transparent: false,
      }

    }
  }

  const layerMaterialsFront = useMemo(() => {
    return frontTextures.map((txt, i) => {
      return new THREE.MeshPhysicalMaterial({
        map: txt,
        side: THREE.DoubleSide,
        ...metallness(isMetallic, i),
        normalScale: new THREE.Vector2(
          // 1 + i * 0.2,
          // 1 + i * 0.2
          (i+1) * 0.02,
          (i+1) * 0.02
        ),
      });
    });
}, [frontTextures]);

  const layerMaterialsBack = useMemo(() => {
    return backTextures.map((txt, i) => {

      txt.wrapS = THREE.RepeatWrapping;
      txt.repeat.x = -1;
      txt.offset.x = 1;
      txt.wrapT = THREE.RepeatWrapping;
      // txt.repeat.x = -1;
      txt.repeat.y = -1;
      txt.offset.y = 1;
      // txt.repeat.x = -1;
      // txt.offset.x = 1;

      const tex = new THREE.MeshPhysicalMaterial({
        map: txt,
        side: THREE.DoubleSide,
        ...metallness(isMetallic, i),
        normalScale: new THREE.Vector2(
          // 1 + i * 0.2,
          // 1 + i * 0.2
          (i+1) * 0.02,
          (i+1) * 0.02
        ),
        
      });


      // if(tex !== null && tex !== null){

      //   // tex.map.wrapS = THREE.RepeatWrapping;
      //   // tex.map.repeat.x = -1;
      //   // tex.map.offset.x = 1;
      //     tex.wrapT = new THREE.RepeatWrapping;
      //     tex.repeat.y = -1;
      //     tex.offset.y = 1;
      // }

      return tex
    });
}, [backTextures]);

  let rolled = false
  let folded = false

  if(item?.COURSE === "Bauhaus Master Lectures") rolled = true
  if(item?.COURSE === "Bauhaus Inhouse") rolled = true
  // if(item?.COURSE === "Introduction Typography") folded = true




  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, 32, 32);

    return geo
  },[item, width, height])


  // useFrame((_, delta) => {
  //   time.current += delta;

  //   if(rolled){

  //     const pos = geometry.attributes.position;
  //     const halfW = width / 2;
  //     const halfH = height / 2;

  //     const amplitude = 0.018;
  //     // const frequency = 2.2;
  //     const frequency = 1.2;
  //     const phase = time.current * 1.2;

  //     for (let i = 0; i < pos.count; i++) {
  //       const x = pos.getX(i);
  //       const y = pos.getY(i);

  //       // normalize
  //       const nx = x / halfW;
  //       const ny = y / halfH;

  //       // 👉 diagonal wave
  //       const diag = nx * 0.3 + ny * 0.6;
     
  //       const z =
  //         Math.sin(diag * Math.PI * frequency + phase) *
  //         amplitude *
  //         Math.cos(ny * Math.PI * 0.5); // edge damping

  //       pos.setZ(i, z);
  //     }
  //     pos.needsUpdate = true;
  //   }
  //   geometry.computeVertexNormals();
  // });
  // const FOLDS_X = 5; // vertical folds (columns)
  // const FOLDS_Y = 1; // horizontal folds (rows)

  const FOLD_ANGLE = Math.PI / 2.2; // ~82°, looks like real fold


  useFrame((_, delta) => {
  time.current += delta;

  const pos = geometry.attributes.position;
  const halfW = width / 2;
  const halfH = height / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    let z = 0;

    /* ======================= ROLLED ======================= */
    if (rolled) {
      const nx = x / halfW;
      const ny = y / halfH;

      const diag = nx * 0.3 + ny * 0.6;
      z +=
        Math.sin(diag * Math.PI * 1.2 + time.current * 1.2) *
        0.018 *
        Math.cos(ny * Math.PI * 0.5);
    }

    // if (folded) {

    //   const FOLDS_X = 1;   // vertical folds → 6 columns
    //   const FOLDS_Y = 5;   // horizontal fold → 2 rows

    //   const FOLD_DEPTH_X = 0.0004; // vertical crease depth
    //   const FOLD_DEPTH_Y = 0.003; // horizontal crease depth

    //   const pos = geometry.attributes.position;

    //   const cols = FOLDS_X + 1;
    //   const rows = FOLDS_Y + 1;

    //   const colW = width / cols;
    //   const rowH = height / rows;

    //   for (let i = 0; i < pos.count; i++) {
    //     const x = pos.getX(i);
    //     const y = pos.getY(i);

    //     /* ===================== segment indices ===================== */
    //     const colIndex = Math.floor((x + width / 2) / colW);
    //     const rowIndex = Math.floor((y + height / 2) / rowH);

    //     /* ===================== linear offsets ===================== */
    //     const zX =
    //       ((colIndex % 2 === 0 ? 1 : -1) * FOLD_DEPTH_X);

    //     const zY =
    //       ((rowIndex % 2 === 0 ? -1 : 1) * FOLD_DEPTH_Y);

    //     pos.setZ(i, zX + zY);
    //   }

    //   pos.needsUpdate = true;
    // }


    /* ======================= FOLDED ======================= */
    if (folded) {

      const foldStrength = 0.0000035        // how much it folds
      const foldSoftness = 0.000012        // how wide the crease is
      const foldDepth = 0.000002           // how much Z displacement
      
      const distToFold = x; // fold at x = 0
      const foldDir = Math.sign(distToFold) || 1;
      const t = Math.abs(distToFold) / halfW;

      // soften crease
      const smooth = Math.exp(-t * t / foldSoftness);

      // bending displacement
      z +=
        foldDir *
        Math.sin(t * Math.PI) *
        foldDepth *
        foldStrength;

      // crease indentation
      z -= smooth * 0.006;
    }

    

    pos.setZ(i, z);
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
});


   
if (!frontTextures[0]) return null;
          
  return (
    <group >
      {layerMaterialsFront.map((mat, i) => (
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
      {layerMaterialsBack.map((mat, i) => (
        <mesh
          key={i}
          geometry={geometry}
          position={[0, 0, -i * 0.0002]} // tiny depth separation
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <primitive attach="material" object={mat} />
        </mesh>
      ))}
    </group>
  );
}

