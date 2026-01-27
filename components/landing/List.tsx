'use client'

import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from './List.module.css'
import { courseShort, TypeCourse, TypeCoursesNames, TypeProject } from '@/types/project-type';
import Overlay from './Overlay';
import ListFooter from './ListFooter';
// import TypeLarge from '../layer2/TypeLarge';
import { ContextMenu } from '../context/ContextMenu';
import ListItem from './ListItem';
import ListHeader from './ListHeader';
// import { render } from '@react-pdf/renderer';
import ListCourse from './ListCourse';
import Background from './Background';
import ListSVG from './ListSVG';
import { convertTableToSVG } from '@/util/convertTableToSVG';
import { cloneDeep} from 'lodash'

interface Props {
    dataStudents: TypeProject[];
    dataCourses: TypeCourse[]
    // activeIndex: null|number;
    // setActiveIndex: (value: number|null) => void;
}

interface Sorting {
    column: 'Name' | 'Title' | 'Course';
    direction: 'asc' | 'desc'
}

interface Filter {

}


const List = ({ dataStudents, dataCourses}: Props) => {



    const [activeIndex, setActiveIndex] = useState<number|null>(null)
    // const doublicatedData = useMemo(() => [...cloneDeep(dataStudents), ...cloneDeep(dataStudents)], dataStudents)


    const { screenHeight, screenWidth, rowHeight } = useContext(ContextMenu)


    const scrollPos = useRef(2000)
    const [ofst, setOfst] = useState(0)
    const refContainer = useRef<HTMLDivElement>(null)

    // 
    const [filter, setFilter ] = useState('')
    // 
    const [sorting, setSorting ] = useState<Sorting>({
        column: 'Name',
        direction: 'asc'
    })

    // 
    const [searchTerm, setSearchTerm ] = useState("")

    const itemHeight = 60

    // const [renderedData, setRenderedData] = useState(doublicatedData)

    // const dataRef = useRef(renderedData)

    // useEffect(() => {


    //     if(filter !== "" || searchTerm !== ''){
    //         setRenderedData(
    //             dataStudents
    //             .filter(d => {

    //                 if(filter === "") return true


    //                 const found = Object.values(d).find(value => value && value.toString().match(new RegExp(filter, 'ig')))

    //                 return found
    //             })
    //             .filter(d => {

    //                 if(searchTerm === "") return true



    //                 const found = Object.values(d).find(value => value && value.toString().match(new RegExp(searchTerm, 'ig')))


    //                 return found
    //             })
    //         )
    //     }else{
    //         setRenderedData(doublicatedData)
    //     }

    // }, [filter, sorting, searchTerm, dataStudents])


    // useEffect(() => {
    //     dataRef.current = renderedData
    // }, [renderedData, refContainer.current])


    const [firstIndex, setFirstIndex] = useState(0)

    // useEffect(() => {

    //     const handleScroll = (e: any) => {

    //         const scrollInc = e.deltaY

    //         // const dir = Math.sign(scrollInc)

    //         const itemsToRemove = 1 + Math.floor(Math.abs(scrollInc)/10)
    //         // const itemsToRemove = 1 

    //         scrollPos.current = scrollInc+scrollPos.current

    //         const newOfst = ofst > 1000 ? 0 : ofst+Math.floor((Math.abs(scrollInc)/10))

    //         setOfst(newOfst)


    //         if(refContainer.current){


    //             if(scrollPos.current >= itemHeight){

    //                 scrollPos.current = 0
    //                 setFirstIndex((firstIndex+itemsToRemove) % dataStudents.length)

    //             }else if(scrollPos.current <= -itemHeight){

    //                 scrollPos.current = 0
    //                 setFirstIndex((firstIndex-itemsToRemove) % dataStudents.length)
                    
    //             }else{

    //                 // scrollPos.current = 0
    //             }
    //             // refContainer.current.scrollTop += 200
    //         }

    //         // 
    //         e.preventDefault()
    //     }

    //     window.addEventListener('wheel', handleScroll, { 
    //         passive: false
    //     })

    //     return () => {

    //         window.removeEventListener('wheel', handleScroll)
    //     }

    // }, [ofst])


    const allCourses: Set<TypeCoursesNames> = new Set((dataStudents.map((item: TypeProject) => item.COURSE)))

    // const course = filter && dataCourses.find(course => course.COURSE) || null

    const activeProject = activeIndex && dataStudents.find(d => d.index === activeIndex) || null

    const courseInfo: TypeCourse|null = dataCourses.find(k => k.COURSE === filter) || null

    if(rowHeight === null) return <></>

    return (
        <>
            <div
            className={styles.scrollWrapper}
            ref={refContainer}
            >
                <div
                className={styles.scrollWrapperInner}
                />
                {
                    activeProject !== null &&
                    <Overlay item={activeProject} autoRotateSpeed={6}/>
                }
                <ul 
                >
                    <ListHeader rowHeight={rowHeight} />
                
                </ul>
                {
                    screenHeight && rowHeight && filter !== "" &&
                    <ListCourse
                    rowHeight={rowHeight}
                    course={courseInfo}
                    screenHeight={screenHeight}
                    dataStudents={dataStudents}
                    // filter={filter}
                    />
                
                }
                <div className={styles.footer}>
                    <ListFooter
                    height={rowHeight*3}
                    setFilter={setFilter}
                    filter={filter}
                    setSorting={setSorting}
                    sorting={sorting}
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                    />
                </div>
                <div 
                style={{ 
                    position: "fixed", 
                    zIndex: -1,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}>
                    <Background text={"Bauhaus Typography"} dir={1}/>
                    <Background text={"EXHIBITION"} dir={-1}/>
                </div>
                




            </div>


            <ListSVG
            dataStudents={dataStudents}
            dataCourses={dataCourses}
            filter={filter}
            searchTerm={searchTerm}
            firstIndex={firstIndex}
            setActiveIndex={setActiveIndex}
            activeIndex={activeIndex}/>


       </>
    )
}

export default List



