// 'use client'

// import { useContext, useEffect, useMemo, useRef, useState } from 'react'
// import styles from './List.module.css'
// import { courseShort, TypeCourse, TypeCoursesNames, TypeProject } from '@/types/project-type';
// import Overlay from './Overlay';
// import ListFooter from './ListFooter';
// // import TypeLarge from '../layer2/TypeLarge';
// import { ContextMenu } from '../context/ContextMenu';
// import ListItem from './ListItem';
// import ListHeader from './ListHeader';
// // import { render } from '@react-pdf/renderer';
// import ListCourse from './ListCourse';
// import Background from './Background';
// import ListSVG from './ListSVG';
// import { convertTableToSVG } from '@/util/convertTableToSVG';
// import { cloneDeep} from 'lodash'

// interface Props {
//     dataStudents: TypeProject[];
//     dataCourses: TypeCourse[]
//     // activeIndex: null|number;
//     // setActiveIndex: (value: number|null) => void;
// }

// interface Sorting {
//     column: 'Name' | 'Title' | 'Course';
//     direction: 'asc' | 'desc'
// }

// interface Filter {

// }


// const List = ({ dataStudents, dataCourses}: Props) => {

//     const [activeIndex, setActiveIndex] = useState<number|null>(null)
//     const doublicatedData = useMemo(() => [...cloneDeep(dataStudents), ...cloneDeep(dataStudents)], dataStudents)


//     const { screenHeight, screenWidth, rowHeight } = useContext(ContextMenu)


//     // const { textToRender, svgPath } = convertTableToSVG({ data: dataStudents, screenHeight, screenWidth, rowHeight })


//     const scrollPos = useRef(2000)
//     const [ofst, setOfst] = useState(0)
//     const refContainer = useRef<HTMLDivElement>(null)

//     // 
//     const [filter, setFilter ] = useState('')
//     // 
//     const [sorting, setSorting ] = useState<Sorting>({
//         column: 'Name',
//         direction: 'asc'
//     })

//     // 
//     const [searchTerm, setSearchTerm ] = useState("")

//     const itemHeight = 60

//     const [renderedData, setRenderedData] = useState(doublicatedData)

//     const dataRef = useRef(renderedData)

//     useEffect(() => {


//         if(filter !== "" || searchTerm !== ''){
//             setRenderedData(
//                 dataStudents
//                 .filter(d => {

//                     if(filter === "") return true


//                     const found = Object.values(d).find(value => value && value.toString().match(new RegExp(filter, 'ig')))

//                     return found
//                 })
//                 .filter(d => {

//                     if(searchTerm === "") return true



//                     const found = Object.values(d).find(value => value && value.toString().match(new RegExp(searchTerm, 'ig')))


//                     return found
//                 })
//             )
//         }else{
//             setRenderedData(doublicatedData)
//         }

//     }, [filter, sorting, searchTerm, dataStudents])


//     useEffect(() => {
//         dataRef.current = renderedData
//     }, [renderedData, refContainer.current])


//     const [firstIndex, setFirstIndex] = useState(0)

//     useEffect(() => {

//         const handleScroll = (e: any) => {

//             const scrollInc = e.deltaY

//             // const dir = Math.sign(scrollInc)

//             const itemsToRemove = 1 + Math.floor(Math.abs(scrollInc)/10)
//             // const itemsToRemove = 1 

//             scrollPos.current = scrollInc+scrollPos.current

//             const newOfst = ofst > 1000 ? 0 : ofst+Math.floor((Math.abs(scrollInc)/10))

//             setOfst(newOfst)


//             if(refContainer.current){


//                 if(scrollPos.current >= itemHeight){

//                     // scrollPos.current -= itemHeight
//                     scrollPos.current = 0

//                     // setFirstIndex((firstIndex + 1) % dataStudents.length)
//                     setFirstIndex((firstIndex+itemsToRemove) % dataRef.current.length)

//                     setRenderedData([
//                         ...dataRef.current.slice(itemsToRemove, dataRef.current.length),
//                         ...dataRef.current.slice(0, itemsToRemove)
//                     ])
//                 }else if(scrollPos.current <= -itemHeight){
//                     // scrollPos.current += itemHeight
//                     scrollPos.current = 0

//                     const approachNeg = (firstIndex-itemsToRemove) % dataRef.current.length

//                     const val = approachNeg < 0 ? dataRef.current.length - approachNeg : approachNeg
//                     // setFirstIndex((firstIndex - 1) % dataStudents.length)
//                     // setFirstIndex(itemsToRemove)
//                     setFirstIndex(val)
                    
//                     setRenderedData([
//                         // dataRef.current[dataRef.current.length-1],
//                         ...dataRef.current.slice(dataRef.current.length-itemsToRemove, dataRef.current.length),
//                         ...dataRef.current.slice(0, dataRef.current.length-itemsToRemove),
//                     ])
//                 }else{

//                     // scrollPos.current = 0
//                 }
//                 // refContainer.current.scrollTop += 200
//             }

//             // 
//             e.preventDefault()
//         }

//         window.addEventListener('wheel', handleScroll, { 
//             passive: false
//         })

//         return () => {

//             window.removeEventListener('wheel', handleScroll)
//         }

//     }, [ofst])



//     const allCourses: Set<TypeCoursesNames> = new Set((dataStudents.map((item: TypeProject) => item.COURSE)))


//     const course = filter && dataCourses.find(course => course.COURSE) || null




//     return (
//         <>
//             <div
//             className={styles.scrollWrapper}
//             ref={refContainer}
//             >
//                 <div
//                 className={styles.scrollWrapperInner}
//                 />
//                 {
//                     activeIndex !== null &&
//                     <Overlay item={renderedData[activeIndex]} autoRotateSpeed={6}/>
//                 }
//                 <ul 
//                 // style={{ paddingTop: rowHeight}}
//                 >
//                     <ListHeader rowHeight={rowHeight} />
//                     { 
//                         renderedData.map((row: any, i: number, all: any[]) => {

//                             return (
//                                 <ListItem
//                                 key={i}
//                                 row={row}
//                                 currentIndex={i}
//                                 rowHeight={rowHeight}
//                                 activeIndex={activeIndex}
//                                 setActiveIndex={setActiveIndex}
//                                 all={all}
//                                 allCourses={allCourses}
//                                 />
//                             )
//                         })
//                     }
//                     {
//                         screenHeight && filter !== "" &&
//                         <ListCourse
//                         rowHeight={rowHeight}
//                         course={course}
//                         screenHeight={screenHeight}
//                         renderedData={renderedData}
//                         // filter={filter}
//                         />
                    
//                     }
//                 </ul>
//                 <div className={styles.footer}>
//                     <ListFooter
//                     height={rowHeight*3}
//                     setFilter={setFilter}
//                     filter={filter}
//                     setSorting={setSorting}
//                     sorting={sorting}
//                     setSearchTerm={setSearchTerm}
//                     searchTerm={searchTerm}
//                     />
//                 </div>
//                 <div 
//                 style={{ 
//                     position: "fixed", 
//                     zIndex: -1,
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                 }}>
//                     <Background text={"Bauhaus Typography"} dir={1}/>
//                     <Background text={"EXHIBITION"} dir={-1}/>
//                 </div>




//                 {/* <TypeLarge text={`Typography\\& Type Design\\${name ? `\\${name}` : ''}\\Exhibition\\6.–8.2.2026`} /> */}
//             {/* <TypeLarge text={`Typography\\& Type Design\\§§§§§§§\\Exhibition\\06.–0.8.02.2026\\§§§§§\\${name ? `\\${name}` : ''}`} /> */}
//                 <svg width="0" height="0">
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
//             </div>



//             <ListSVG dataStudents={dataStudents} filter={filter} searchTerm={searchTerm} firstIndex={firstIndex}/>

//         </>
//     )
// }

// export default List



export {}