import { ContextMenu } from "@/components/context/ContextMenu";
import { TypeProject } from "@/types/project-type";
import { useContext } from "react";

interface TxtProps { 
    position: 
    { 
        x: number;
        y: number;
        height: number;
        data: TypeProject;
    };
    text: string|null|false; 
    fill?: string;
};

const TextSVG = ({
    position,
    text,
    fill,
}: TxtProps) => {


    const {
        fontSize,
        rowHeight: height
    } = useContext(ContextMenu)

    if(!text || !fontSize || !height) return <></>



    const typeIndex = Object.values(position.data).findIndex(v => v === text)

    const type = Object.keys(position.data)[typeIndex]


    if(type === 'NAME'){

        return (
            <>
                {
                    text.split(',').map((name, i) => (

                        <text
                        key={i}
                        style={{
                            textTransform: "uppercase",
                            fontSize,
                            background: "red"
                        }}
                        x={position.x}
                        // y={position.y}
                        y={position.y+height*2-fontSize*1.5+i*height}
                        // y={position.y-fontSize*1.8+fontSize*0.3}
                        fontSize={fontSize}
                        fontWeight="bold"
                        fill={fill || "black"}
                        >
                            {name}
                        </text>
                    ))
                }
            </>
        )

    }

    return (<>
        <text
        style={{
            textTransform: "uppercase",
            fontSize,
            background: "red"
        }}
        x={position.x}
        y={position.y+height*2-fontSize*1.5}
        fontSize={fontSize}
        fontWeight="bold"
        fill={fill || "black"}
        >
            {text}
        </text>
    </>
)}

export default TextSVG