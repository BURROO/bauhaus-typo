import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { ContextMenu } from "../context/ContextMenu"
import { TypeCourse, TypeProject } from "@/types/project-type"
import { render } from "@react-pdf/renderer";
import { adjustYtoOrder, convertAreaToSVG, convertTableToSVG } from "@/util/convertTableToSVG";
import { cloneDeep } from 'lodash'
import Link from "next/link";
import { sanitizeForUrl } from "@/util/sanitizeForUrl";

import { useRouter } from "next/navigation"

// const gray = `rgba(200,200,200, 0.97)`;
const gray = `rgb(200,200,200)`;
// const grayFont = `rgba(180,180,180, 0.97)`;
const grayFont = `rgba(170,170,170, 0.97)`;
const color = "cyan";


export const txtTopOfst = 12
export const txtLeftOfst = 2

interface Props {
    dataStudents: TypeProject[];
    dataCourses: TypeCourse[];
    filter: string;
    searchTerm: string;
    firstIndex: number;
    setActiveIndex: (valie: number|null) => void;
    activeIndex: null|number;
}


// const columns: { [key: string]: { col: number; text: string, fill: boolean; }[]} = {
//     'large': [
//         {
//             col: 2/11,
//             text: 'Studierende',
//             fill: false,
//         },{
//             col: 2/11,
//             text: 'Title',
//             fill: false,
//         }, {
//             col: 1/11,
//             text: 'Type',
//             fill: false,
//         }, {
//             col: 1/11,
//             text: 'Format',
//             fill: false,
//         }, {
//             col: 2/11,
//             text: 'Kurs',
//             fill: false,
//         }, {
//             col: 2/11,
//             text: 'Supervision',
//             fill: true,
//         }, {
//             col: 1/11,
//             text: 'Id',
//             fill: false,
//         }
//     ],
//     'medium': [
//         {
//             col: 2/7,
//             text: 'Studierende',
//             fill: false,
//         },{
//             col: 2/7,
//             text: 'Title',
//             fill: false,
//         }, {
//             col: 1/7,
//             text: 'Type',
//             fill: false,
//         }, 
//         // {
//         //     col: 1/7,
//         //     text: 'Format',
//         //     fill: false,
//         // }, 
//         {
//             col: 2/7,
//             text: 'Kurs',
//             fill: false,
//         }, 
//         // {
//         //     col: 2/7,
//         //     text: 'Supervision',
//         //     fill: true,
//         // },
//          {
//             col: 1/7,
//             text: 'Id',
//             fill: false,
//         }
//     ]



// // grid-template-columns: 2fr 2fr 1fr 1fr 69px;
// }

const ListSVG = ({ dataStudents, dataCourses, filter, searchTerm, firstIndex, setActiveIndex, activeIndex }: Props) => {


    const { screenHeight, screenWidth, rowHeight } = useContext(ContextMenu)

    const router = useRouter()

    const originalOrder = useMemo(() => {
        
        const textToRender = convertTableToSVG({ 
            data: [...dataStudents], 
            screenHeight, 
            screenWidth, 
            rowHeight,
            activeIndex
        })


        return textToRender
    }, [dataStudents, screenHeight, screenWidth, rowHeight, activeIndex])

    const [renderData, setRenderedData ] = useState(originalOrder)


    const refContainer = useRef<HTMLDivElement>(null)


    useEffect(() => {

        // 

        let newOrder = [
            ...cloneDeep(originalOrder).slice(firstIndex, originalOrder.length),
            ...cloneDeep(originalOrder).slice(0, firstIndex)
        ]



        if(filter !== "" || searchTerm !== ''){
            newOrder = newOrder
            .filter(d => {



                if(filter === "") return true

                const data = d[0]?.data

                const found = Object.values(data).find(value => value && value.toString().match(new RegExp(filter, 'ig')))

                return found
            })
            .filter(d => {

                if(searchTerm === "") return true


                const data = d[0]?.data

                const found = Object.values(data).find(value => value && value.toString().match(new RegExp(searchTerm, 'ig')))


                return found
            })
            setRenderedData(adjustYtoOrder([...newOrder]))
        }else{
            setRenderedData(adjustYtoOrder([...newOrder, ...newOrder]))

        }

    // }, [filter, sorting, searchTerm, dataStudents])


   
    }, [firstIndex, originalOrder, filter, searchTerm])



    const {svgPath, svgActivePath } = useMemo(() => convertAreaToSVG({ textToRender: renderData }), [firstIndex, renderData, activeIndex])

    const maskId = useMemo(
        () => `text-mask-${firstIndex}`,
        [firstIndex]
    )

    const gradientId = useMemo(
        () => `metalGradient-${firstIndex}`,
        [firstIndex]
    )

    const maskFilterId = useMemo(
        () => `text-mask-filter-${firstIndex}`,
        [firstIndex]
    )

    if(screenHeight === null || screenWidth === null || rowHeight === null) return <></>


    const courseInfo: TypeCourse|null = dataCourses.find(k => k.Kurs === filter) || null

    console.log("filter", filter, dataCourses, courseInfo)

    return (
        <div
        ref={refContainer}
        style={{
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            width: screenWidth,
            height: screenHeight,
            zIndex: 0,
            // pointerEvents: "none",
            // opacity: 0.92,
            opacity: 0.97
        }}>
            <svg 
            viewBox={`0 0 ${screenWidth} ${screenHeight}`}
            width={screenWidth}
            height={screenHeight}
            >
                <defs>
                  
                    <linearGradient
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    x1="0" 
                    y1="0"
                    x2={screenWidth*3} 
                    y2="0"
                    gradientTransform={`rotate(25 ${screenWidth / 2} ${screenHeight / 2})`}
                    >
                    {/* <stop offset="0%" stopColor="rgb(200,200,200)"/>
                    <stop offset="45%" stopColor="rgb(180,180,180)"/>
                    <stop offset="55%" stopColor="rgb(200,200,200)"/>
                    <stop offset="100%" stopColor="rgb(220,220,220)"/> */}

                    {/* <stop offset="0%" stopColor="rgb(200,200,200)"/>
                    <stop offset="45%" stopColor="rgb(128, 128, 128)"/>
                    <stop offset="55%" stopColor="rgb(200,200,200)"/>
                    <stop offset="100%" stopColor="rgb(220,220,220)"/> */}

                    <stop offset="0%" stopColor="rgb(190,190,190)"/>
                    <stop offset="45%" stopColor="rgb(150, 150, 150)"/>
                    <stop offset="50%" stopColor="rgb(180,180,180)"/>
                    <stop offset="100%" stopColor="rgb(190,190,190)"/>

                    <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    additive="sum"
                    from={`-${screenWidth} 0`}
                    to={`${screenWidth} 0`}
                    dur="6s"
                    repeatCount="indefinite"
                    />

                    </linearGradient>


                    <filter id="metalFoil">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.02"
                            numOctaves="2"
                            seed="2"
                            result="noise"
                        />

                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="8"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="distorted"
                        />
                        <feColorMatrix
                            in="distorted"
                            type="matrix"
                            values="
                            1.4 0   0   0 0
                            0   1.4 0   0 0
                            0   0   1.4 0 0
                            0   0   0   1 0"
                        />
                    </filter>


                    <filter id="paperInkGrain" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.9"
                            numOctaves="1"
                            seed="7"
                            result="paper"
                        />

                        {/* <feTurbulence
                            type="turbulence"
                            baseFrequency="0.18"
                            numOctaves="2"
                            seed="3"
                            result="inkNoise"
                        /> */}

                        <feColorMatrix
                            in="inkNoise"
                            type="matrix"
                            values="
                            0.33 0.33 0.33 0 0
                            0.33 0.33 0.33 0 0
                            0.33 0.33 0.33 0 0
                            0    0    0    1.3 0"
                            result="inkAlpha"
                        />

                        <feComponentTransfer in="inkAlpha" result="inkThreshold">
                            <feFuncA type="gamma" exponent="0.45" />
                        </feComponentTransfer>

                        <feComposite
                            in="SourceGraphic"
                            in2="inkThreshold"
                            operator="in"
                            result="inked"
                        />

                        <feComposite
                            in="inked"
                            in2="paper"
                            operator="multiply"
                        />
                    </filter>

                    <mask id={maskId}>
                        <rect
                        x="0"
                        y="0"
                        width={screenWidth}
                        height={screenHeight}
                        fill="white"
                        />

                        {
                            renderData
                                
                            .map((row, i) => {


                                if(i === 0) return <g key={i}></g>
                                
                                    
                                return (
                                    <g key={i}>
                                        {
                                            row.map((d, k) => (

                                                <text
                                                style={{
                                                    textTransform: "uppercase"
                                                }}
                                                key={k}
                                                x={d.x}
                                                y={d.y}
                                                fontSize={48}
                                                fontWeight="bold"
                                                fill={"black"}
                                                >
                                                    {!d.hideText && d.text}
                                                </text>
                                            ))
                                        }

                                    </g>
                                )
                            })
                        }
                    </mask>


                    {filter !== "" && <mask id={maskFilterId}>
                        <rect
                        x="0"
                        y={0}
                        width={screenWidth}
                        height={screenHeight}
                        fill="white"
                        />
                            {/* <text
                            style={{
                                textTransform: "uppercase"
                            }}
                            x={txtLeftOfst}
                            y={txtTopOfst+rowHeight}
                            fontSize={48}
                            fontWeight="bold"
                            fill={"black"}
                            >
                                { courseInfo.Title}
                            </text>
                            <g transform={`translate(0 ${txtTopOfst+rowHeight})`}>
                                {
                                    splitEveryNWords(courseInfo["Text DE"]).map((snipper, i) => (
                                        <text
                                        key={i}
                                        style={{
                                            textTransform: "uppercase"
                                        }}
                                        x={txtLeftOfst}
                                        y={txtTopOfst+rowHeight + i * rowHeight}
                                        fontSize={48}
                                        fontWeight="bold"
                                        fill={"black"}
                                        >
                                            {snipper}
                                        </text>

                                    ))
                                }
                            </g> */}

                    </mask>}
                </defs>

                <path
                d={`M 0 ${0} L ${screenWidth} ${0} L ${screenWidth} ${rowHeight} L 0 ${rowHeight}`}
                fill={`url(#${gradientId})`}
                mask={`url(#${maskId})`}
                />
                <g  transform={`translate(0 ${rowHeight})`}>
                    {
                        renderData
                        // .slice(12,200)
                        .map((row, i) => {
                            

                        
                            return (
                                <g key={i}>
                                    {
                                        row.map((d, k) => (

                                            <text
                                            key={k}
                                            x={d.x}
                                            y={d.y}
                                            fontSize={48}
                                            fontWeight="bold"
                                            // fill={d.isActive ? "black" : !d.fill ? gray : "transparent"}
                                            // fill={!d.fill && i !== 0  ? grayFont : "transparent"}
                                            fill={!d.fill  ? grayFont : "transparent"}

                                            style={{
                                                textTransform: "uppercase"
                                            }}
                                            >

                                                {!d.hideText && (!d.fill || d.isActive) && d.text}
                                            </text>
                                        ))
                                    }

                                </g>

                            )
                        })
                    }



                    {/* REST */}
                    {/* <rect
                    x={0}
                    y={-rowHeight}
                    width={screenWidth}
                    height={rowHeight}
                    // fill="red"
                    fill={`url(#${gradientId})`}
                    // mask={`url(#${maskId})`}
                    /> */}
                    <path
                    d={svgPath}
                    fill={`url(#${gradientId})`}
                    mask={`url(#${maskId})`}
                    />
                    {/* ACtive Path */}
                    <path
                    d={svgActivePath}
                    // fill={gray} 
                    fill="cyan"
                    // filter="url(#metalFoil)"
                    mask={`url(#${maskId})`}
                    />
                    {/* <path
                    style={{
                        opacity: "0.3"
                    }}
                    d={svgPath}
                    fill={"white"} 
                    filter="url(#paperInkGrain)"
                    mask={`url(#${maskId})`}
                    /> */}
                  

                    {/* ACTIVE OVERLAY */}
                    {
                        renderData.map((row, i) => {
                            


                        
                            return (
                                <g key={i}>
                                    {
                                        row
                                        .filter(d => d.isActive)
                                        .map((d, i) => (

                                            <text
                                            key={i}
                                            x={d.x}
                                            y={d.y}
                                            fontSize={48}
                                            fontWeight="bold"
                                            fill={"black"}

                                            style={{
                                                textTransform: "uppercase"
                                            }}
                                            >

                                                {!d.hideText  && d.text}
                                            </text>
                                        ))
                                    }

                                </g>

                            )
                        })
                    }
                      <g data-info="hover-el">
                    {
                        renderData.map((row, i) => {


                            const kurs = sanitizeForUrl(row[0].data?.Kurs)
                            const studierende = sanitizeForUrl(row[0].data?.Studierende)
                            
                            return (
                                <g
                                key={i}
                                onMouseEnter={() =>setActiveIndex(row[0].index)}
                                onMouseLeave={() => setActiveIndex(null)}
                                // onClick={() => {}}
                                >
                                    {/* <Link href={`/${kurs}/${studierende}`}> */}
                                    <a
                                    href={`/${kurs}/${studierende}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        router.push(`/${kurs}/${studierende}`)
                                    }}
                                    >
                                          <rect
                                        x={0}
                                        y={row[0].y-row[0].height}
                                        width={screenWidth}
                                        height={row[0].height}
                                        fill="transparent"
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        />
                                    </a>
                                </g>

                            )
                        })
                    }
                    </g>



                    {/* Filöter info */}
                    {filter !== "" && <g transform={`translate(${0} ${renderData.length * rowHeight-1})`}>


                        {/* Handle */}

                        {/* <text  /> */}


                        <rect 
                        x={0}
                        y={0}
                        width={screenWidth}
                        height={screenHeight - renderData.length * rowHeight}
                        fill={`url(#${gradientId})`}
                        mask={`url(#${maskFilterId})`}
                        // fill="red"
                        />
                        
                        
                        
                    </g>}


                </g>



            </svg>
        </div>
    )

}


export default ListSVG



//   <svg width="0" height="0">
//                     <filter id="screenPrintEffect">
//                         {/* <!-- Generate noise pattern --> */}
//                         <feTurbulence type="turbulence" baseFrequency="0.95" numOctaves="3" result="turbulence"/>
                        
//                         {/* <!-- Convert to grayscale and boost contrast --> */}
//                         <feColorMatrix in="turbulence" type="matrix" values="0.33 0.33 0.33 0 0
//                                                                             0.33 0.33 0.33 0 0
//                                                                             0.33 0.33 0.33 0 0
//                                                                             0 0 0 0.6 0" result="grayscale"/>
                        
//                         {/* <!-- Apply threshold to create sharp black/white dots --> */}
//                         <feComponentTransfer in="grayscale" result="thresholded">
//                         <feFuncA type="discrete" tableValues="0 1"/>
//                         </feComponentTransfer>
                        
//                         {/* <!-- Use the pattern as a mask or displacement map --> */}
//                         <feComposite in="SourceGraphic" in2="thresholded" operator="in" result="screenPrinted"/>
//                     </filter>
//                 </svg>


