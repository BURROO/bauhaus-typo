import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { ContextMenu } from "../../context/ContextMenu"
import { TypeCourse, TypeProject, TypeProjectForSVG } from "@/types/project-type"
import { adjustYtoOrder, convertAreaToSVG, convertTableToSVG } from "@/util/convertTableToSVG";
import { cloneDeep } from 'lodash'
import { getUrlFromProject } from "@/util/sanitizeForUrl";

import { useRouter } from "next/navigation"
import TextSVG from "./TextSVG";
import ListRowSVG from "./ListRowSVG";
import DefFiltersSVG from "./DefFiltersSVG";
import PathSVG from "./PathSVG";
import { getTotalLinesForListOfPojects } from "@/util/handleNameSplitting";

// const gray = `rgba(200,200,200, 0.97)`;
const gray = `rgb(200,200,200)`;
// const grayFont = `rgba(180,180,180, 0.97)`;
const grayFont = `rgba(170,170,170, 0.97)`;
const color = "cyan";


// export const txtTopOfst = 12
export const txtLeftOfst = 2

interface Props {
    dataStudents: TypeProject[];
    // dataCourses: TypeCourse[];
    filter: string;
    searchTerm: string;
    // firstIndex: number;
    // setActiveIndex: (valie: number|null) => void;
    // activeIndex: null|number;
}


const ListSVG = ({
    dataStudents,
    // dataCourses,
    filter,
    searchTerm,
    // firstIndex,
    // setActiveIndex,
    // activeIndex
}: Props) => {


    const {
        screenHeight,
        screenWidth,
        rowHeight,
        setActiveIndex,
        activeIndex,
    } = useContext(ContextMenu)

    const router = useRouter()

    const originalOrder = useMemo(() => {

        // console.log("retrigger og order")

        const textToRender = convertTableToSVG({ 
            data: [...dataStudents], 
            screenHeight, 
            screenWidth, 
            rowHeight,
            activeIndex,
            filter
        })

        return textToRender
    }, [
        // dataStudents, screenHeight, screenWidth, rowHeight, activeIndex
    ])

    const [renderData, setRenderedData ] = useState<TypeProjectForSVG[][]>(originalOrder)


    const refContainer = useRef<HTMLDivElement>(null)


    useEffect(() => {

        // 

        // let newOrder = originalOrder

        const filteredStudents = dataStudents
        .filter(d => {

            if(filter === "") return true

            const data = d

            // const found = Object.values(data).find(value => value && value.toString().match(new RegExp(filter, 'ig')))
            const foundName = data.NAME.toString().match(new RegExp(filter, 'ig'))
            const foundCourse = data.COURSE.toString().match(new RegExp(filter, 'ig'))
            const foundSupervision = data.SUPERVISION.toString().match(new RegExp(filter, 'ig'))
            const foundMedium = data.MEDIUM.toString().match(new RegExp(filter, 'ig'))

            return foundName || foundCourse || foundSupervision || foundMedium
        })
        .filter(d => {

            if(searchTerm === "") return true


            const data = d

            const found = Object.values(data).find(value => value && value.toString().match(new RegExp(searchTerm, 'ig')))


            return found
        })
    


        let newOrder = convertTableToSVG({ 
            data: [...filteredStudents], 
            screenHeight, 
            screenWidth, 
            rowHeight,
            activeIndex,
            filter
        })


        if(newOrder == null) {
            setRenderedData([])
            return;
        }else{
            setRenderedData(adjustYtoOrder([...newOrder]))

        }

        // if(filter !== "" || searchTerm !== ''){
        //     newOrder = newOrder
        //     .filter(d => {



        //         if(filter === "") return true

        //         const data = d[0]?.data

        //         // const found = Object.values(data).find(value => value && value.toString().match(new RegExp(filter, 'ig')))
        //         const foundName = data.NAME.toString().match(new RegExp(filter, 'ig'))
        //         const foundCourse = data.COURSE.toString().match(new RegExp(filter, 'ig'))
        //         const foundSupervision = data.SUPERVISION.toString().match(new RegExp(filter, 'ig'))
        //         const foundMedium = data.MEDIUM.toString().match(new RegExp(filter, 'ig'))

        //         return foundName || foundCourse || foundSupervision || foundMedium
        //     })
        //     .filter(d => {

        //         if(searchTerm === "") return true


        //         const data = d[0]?.data

        //         const found = Object.values(data).find(value => value && value.toString().match(new RegExp(searchTerm, 'ig')))


        //         return found
        //     })
        //     setRenderedData(adjustYtoOrder([...newOrder]))
        // }else{
        //     setRenderedData(adjustYtoOrder([...newOrder]))
        //     // setRenderedData(adjustYtoOrder([...newOrder, ...newOrder]))

        // }

    // }, [filter, sorting, searchTerm, dataStudents])


   
    }, [
        filter, 
        searchTerm,
        dataStudents, 
        screenHeight,
        screenWidth, 
        rowHeight, 
        activeIndex
    ])


    // console.log("renderData", renderData)
    const { svgPath, svgActivePath } = useMemo(() => convertAreaToSVG({ textToRender: renderData }), [renderData])

    const maskId = useMemo(
        () => `text-mask`,
        []
    )

    const gradientId = useMemo(
        () => `metalGradient`,
        []
    )

    const maskFilterId = useMemo(
        () => `text-mask-filter`,
        []
    )

    if(screenHeight === null || screenWidth === null || rowHeight === null) return <></>


    // const courseInfo: TypeCourse|null = dataCourses.find(k => k.COURSE === filter) || null
    const rowCOunt = getTotalLinesForListOfPojects({ projects: (renderData).map(r => r[0].data) })


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
            opacity: 0.97
        }}>
            <svg 
            viewBox={`0 0 ${screenWidth} ${screenHeight}`}
            width={screenWidth}
            height={screenHeight}
            >
                <defs>
                    <DefFiltersSVG 
                    gradientId={gradientId}
                    />
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

                                return (
                                    <ListRowSVG key={i} row={row} />
                                    // <g key={i}>
                                    //     {
                                    //         row.map((d, k) => (
                                    //             <TextSVG 
                                    //             key={k}
                                    //             position={d}
                                    //             text={!d.hideText && d.text}
                                    //             />
                                    //         ))
                                    //     }
                                    // </g>
                                )
                            })
                        }
                    </mask>

                    {filter !== "" && 
                    <mask id={maskFilterId}>
                        <rect
                        x="0"
                        y={0}
                        width={screenWidth}
                        height={screenHeight}
                        fill="white"
                        />
                    </mask>}
                </defs>

                {/* <path
                d={`M 0 ${0} L ${screenWidth} ${0} L ${screenWidth} ${rowHeight+1} L 0 ${rowHeight+1}`}
                fill={`url(#${gradientId})`}
                /> */}
                <g  transform={`translate(0 ${0})`}>
                    {
                        renderData
                        .map((row, i) => {
                        
                            return (
                                <g key={i}>
                                    {
                                        row.map((d, k) => (

                                            <TextSVG 
                                            key={k}
                                            position={d}
                                            fill={!d.fill  ? grayFont : "transparent"}
                                            text={!d.hideText && (!d.fill || d.isActive) && d.text}
                                            />
                                        ))
                                    }
                                    {/* <ListRowSVG
                                    row={row}
                                    fillSwitch={{ condition: 'fill', case1: grayFont, case2: 'transparent'}}
                                    /> */}
                                </g>
                            )
                        })
                    }
                    {/* <path
                    d={svgPath}
                    fill={`url(#${gradientId})`}
                    mask={`url(#${maskId})`}
                    />
                    <path
                    d={svgPath}
                    filter={`url(#screenPrintEffect)`}
                    fill="rgba(240,240,240,0.4)"
                    /> */}
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
                    {/* ACTIVE OVERLAY */}
                    {
                        renderData.map((row, i) => {
                        


                            return (
                                <g key={i}>
                                    <ListRowSVG
                                    row={row}
                                    filters={["isActive"]}
                                    />
                                    {/* {
                                        row
                                        .filter(d => {

                                            
                                            return d.isActive === true
                                        })
                                        .map((d, i) => (
                                            <TextSVG
                                            key={i}
                                            position={d}
                                            text={!d.hideText  && d.text}
                                            />
                                        ))
                                    } */}

                                </g>
                            )
                        })
                    }
                      <g data-info="hover-el">
                    {
                        renderData.map((row, i) => {

                            const url = getUrlFromProject(row[0].data)

                            // console.log(row[0].data)

                            const index = row[0].data.index
                            
                            return (
                                <g
                                key={i}
                                onMouseEnter={() =>setActiveIndex(index)}
                                // onMouseEnter={() =>setActiveIndex(i)}
                                onMouseLeave={() => setActiveIndex(null)}
                                // onClick={() => {}}
                                >
                                    {/* <a
                                    aria-label={`Link to ${row[0]?.data.NAME}`}
                                    href={url}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        router.push(url)
                                    }}
                                    > */}
                                        <rect
                                        aria-label={`Link to ${row[0]?.data.NAME}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            router.push(url)
                                        }}
                                        x={0}
                                        y={row[0].y}
                                        width={screenWidth}
                                        height={row[0].height}
                                        fill="transparent"
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        />
                                    {/* </a> */}
                                </g>
                            )
                        })
                    }
                    </g>
                    {/* Filöter info */}
                    {filter !== "" && <g data-filter="true" transform={`translate(${0} ${rowCOunt * rowHeight - 2
                    })`}>
                        <rect 
                        x={0}
                        y={0}
                        width={screenWidth}
                        height={screenHeight - (rowCOunt * rowHeight) + 2}
                        fill={`url(#${gradientId})`}
                        />
                    </g>}
                </g>
            </svg>
        </div>
    )

}


export default ListSVG
