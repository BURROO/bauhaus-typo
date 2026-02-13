import { useFrame, useThree } from "@react-three/fiber";
import JSZip from "jszip";
import { useEffect, useRef } from "react";
// import { saveAs } from 'file-saver'
import { saveAs } from "file-saver";
import { TypeProject } from "@/types/project-type";
// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile } from "@ffmpeg/util";

// const ffmpeg = new FFmpeg();
// await ffmpeg.load();

const WARMUP_FRAMES = 40; // usually 10–20 is enough

const FrameExporter = ({
  totalFrames = 240,
  radius = 6 / 1.5,
  goNext,
  currentProject
}: {
  totalFrames?: number;
  radius?: number;
  goNext: () => void;
  currentProject: TypeProject|null
}) => {
    const { gl, camera, scene } = useThree();
    // const frame = useRef(0);     
    const frame = useRef(-WARMUP_FRAMES);
    const zip = useRef(new JSZip());


    useEffect(() => {
        gl.compile(scene, camera);
    }, []);


    // useFrame(async() => {
    //     if (frame.current >= totalFrames) return;

    //     const angle = (frame.current / totalFrames) * Math.PI * 2;

    //     camera.position.x = Math.sin(angle) * radius;
    //     camera.position.z = Math.cos(angle) * radius;
    //     camera.lookAt(0, 0, 0);
    //     camera.updateMatrixWorld();

    //     const dataURL = gl.domElement.toDataURL("image/png");
    //     const base64 = dataURL.split(",")[1];

    //     zip.current.file(
    //     `frame_${String(frame.current).padStart(4, "0")}.png`,
    //     base64,
    //     { base64: true }
    //     );

    //     frame.current++;

    //     // Finish → download ZIP
    //     if (frame.current === totalFrames) {
    //     zip.current.generateAsync({ type: "blob" }).then((blob) => {
    //         saveAs(blob, `${currentProject?.TITLE}.zip`);
    //         console.log("PNG sequence exported");
    //         goNext()
    //     });
    //     }

    //     // for (let i = 0; i < totalFrames; i++) {
    //     //     const png = zip.current.file(`frame_${String(i).padStart(4, "0")}.png`);
    //     //     if (!png) continue;

    //     //     const data = await png.async("uint8array");
    //     //     await ffmpeg.writeFile(
    //     //         `frame_${String(i).padStart(4, "0")}.png`,
    //     //         data
    //     //     );
    //     // }

    //     // await ffmpeg.exec([
    //     // "-framerate", "24",
    //     // "-i", "frame_%04d.png",
    //     // "-c:v", "libx264",
    //     // "-pix_fmt", "yuv420p",
    //     // "out.mp4"
    //     // ]);

    //     // const video = await ffmpeg.readFile("out.mp4");
    //     // saveAs(
    //     // new Blob([video.buffer], { type: "video/mp4" }),
    //     // `${currentProject?.TITLE}.mp4`
    //     // );

    // });

    useFrame(() => {
        // Warm-up phase: render only, don't capture
        if (frame.current < 0) {
            frame.current++;
            return;
        }

        if (frame.current >= totalFrames) return;

        const angle = (frame.current / totalFrames) * Math.PI * 2;

        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();

        const dataURL = gl.domElement.toDataURL("image/png");
        const base64 = dataURL.split(",")[1];

        zip.current.file(
            `frame_${String(frame.current).padStart(4, "0")}.png`,
            base64,
            { base64: true }
        );

        frame.current++;

        if (frame.current === totalFrames) {
            zip.current.generateAsync({ type: "blob" }).then((blob) => {
                saveAs(blob, `${currentProject?.TITLE}.zip`);
                goNext();
            });
        }
    });

    return null;
};


export default FrameExporter