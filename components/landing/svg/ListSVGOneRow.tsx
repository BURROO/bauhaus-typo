import { useContext,useMemo } from "react"
import { ContextMenu } from "../../context/ContextMenu"
import {  TypeProject } from "@/types/project-type"
import { convertAreaToSVG, convertTableToSVG } from "@/util/convertTableToSVG";


import ListRowSVG from "./ListRowSVG";
import DefFiltersSVG from "./DefFiltersSVG";
import PathSVG from "./PathSVG";

const gray = `rgb(200,200,200)`;
const grayFont = `rgba(170,170,170, 0.97)`;
const color = "cyan";


// export const txtTopOfst = 12
export const txtLeftOfst = 2

interface Props {
    dataStudent: TypeProject;
    isOpen: boolean;
    // dataCourses: TypeCourse[];
}

const ListSVGOneRow = ({
    dataStudent,
    isOpen
}: Props) => {


    const {
        screenHeight,
        screenWidth,
        rowHeight,
    } = useContext(ContextMenu)

    if(screenHeight === null || screenWidth === null || rowHeight === null) return <></>
   
    const row = useMemo(() => {

        const textToRender = convertTableToSVG({ 
            data: [dataStudent], 
            screenHeight, 
            screenWidth, 
            rowHeight,
            activeIndex: -1
        })



        return textToRender[0]
    }, [dataStudent, screenHeight, screenWidth, rowHeight])



    const {svgPath, svgActivePath } = useMemo(() => convertAreaToSVG({ textToRender: [row] }), [row])

    const maskId = `text-mask`

    const gradientId = `metalGradient`

    const maskFilterId = `text-mask-filter`

    if(screenHeight === null || screenWidth === null || rowHeight === null) return <></>


    const w = screenWidth
    const h = isOpen ? Math.floor(screenHeight / row[0].height * 0.5) * row[0].height : row[0].height - rowHeight

    return (
   
        <svg 
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        // height={200}
        height={h}
        >
            <defs>
                <DefFiltersSVG 
                gradientId={gradientId}
                />
                <mask id={maskId}>
                    <rect
                    x="0"
                    y="0"
                    width={w}
                    height={h}
                    fill="white"
                    />
                    
                    <ListRowSVG row={row} />
                                
                </mask>
            </defs>

            {/* <path
            d={`M 0 ${0} L ${screenWidth} ${0} L ${screenWidth} ${rowHeight+1} L 0 ${rowHeight+1}`}
            fill={`url(#${gradientId})`}
            /> */}
            <g  transform={`translate(0 ${0})`}>
                
                {
                    isOpen &&
                    // <rect x={0} y={0} width={w} height={h} fill={"black"} />
                    <PathSVG
                    svgPath={`M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} z`}
                    gradientId={gradientId}
                    maskId={maskId}
                    />
                }
                
                <PathSVG
                svgPath={svgPath}
                gradientId={gradientId}
                maskId={maskId}
                />


                
                {/* ACtive Path */}
                <path
                d={svgActivePath}
                fill={color}
                mask={`url(#${maskId})`}
                />
            </g>
        </svg>
    )

}


export default ListSVGOneRow
