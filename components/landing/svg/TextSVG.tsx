import { ContextMenu } from "@/components/context/ContextMenu";
import { TypeProject } from "@/types/project-type";
import { getNameAsArray, getTitleAsArray } from "@/util/handleNameSplitting";
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



        const nameArray = getNameAsArray(text)

        return (
            <>
                {
                    nameArray.map((name, i) => (
                    // text.split(/,|:/ig).map((name, i) => (

                        // <text
                        // key={i}
                        // style={{
                        //     textTransform: "uppercase",
                        //     fontSize,
                        //     background: "red"
                        // }}
                        // x={position.x}
                        // // y={position.y}
                        // y={position.y+height*2-fontSize*1.5+i*height}
                        // // y={position.y-fontSize*1.8+fontSize*0.3}
                        // fontSize={fontSize}
                        // fontWeight="bold"
                        // fill={fill || "black"}
                        // >
                        //     {name}
                        // </text>
                        <TextContainer key={i} text={name} position={position} fill={fill || "black"} index={i} />
                    ))
                }
            </>
        )

    } else if(type === "TITLE"){



        const titleArray = getTitleAsArray(text)


        // if(text.toLowerCase().match('a visual diss')){
            
        //     return (

        //         <>
        //             {
        //                 ['A visual Dissection of', 'the Ok-Sign'].map((name, i, all) => (
        //                 // text.split(/,|:/ig).map((name, i) => (

        //                     <TextContainer key={i} text={name} position={position} fill={fill || "black"} index={i}/>
        //                 ))
        //             }
        //         </>
        //     )
        // }

        return (
            <>
                {
                    // text.split(':').map((name, i, all) => (
                    titleArray.map((name, i, all) => (
                    // text.split(/,|:/ig).map((name, i) => (

                        <TextContainer key={i} text={name + (i === 0 && all.length > 1 ? ':' : '')} position={position} fill={fill || "black"} index={i}/>
                        // <text
                        // key={i}
                        // style={{
                        //     textTransform: "uppercase",
                        //     fontSize,
                        //     background: "red"
                        // }}
                        // x={position.x}
                        // // y={position.y}
                        // y={position.y+height*2-fontSize*1.5+i*height}
                        // // y={position.y-fontSize*1.8+fontSize*0.3}
                        // fontSize={fontSize}
                        // fontWeight="bold"
                        // fill={fill || "black"}
                        // >
                        //     {name}
                        // </text>
                    ))
                }
            </>
        )
    }

    return <TextContainer text={text} position={position} fill={fill || "black"} index={0}/>

    // return (<>
    //     <text
    //     style={{
    //         textTransform: "uppercase",
    //         fontSize,
    //         background: "red"
    //     }}
    //     x={position.x}
    //     y={position.y+height*2-fontSize*1.5}
    //     fontSize={fontSize}
    //     fontWeight="bold"
    //     fill={fill || "black"}
    //     >
    //         {text}
    //     </text>
    // </>)
}

export default TextSVG


const TextContainer = ({ text, position, fill, index }: { text: string; position: { x: number; y: number }; fill: string; index: number }) => {
    

    const {
        fontSize,
        rowHeight: height
    } = useContext(ContextMenu)

    if(!text || !fontSize || !height) return <></>
    
    
    return (
    
        <text
        style={{
            textTransform: "uppercase",
            fontSize,
            background: "red"
        }}
        x={position.x}
        // y={position.y+height*2-fontSize*1.5}
        y={position.y+height*2-fontSize*1.5+index*height}
        fontSize={fontSize}
        fontWeight="bold"
        fill={fill || "black"}
        >
            {text}
        </text>
)}