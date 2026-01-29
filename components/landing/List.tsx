'use client'

import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from './List.module.css'
import {  TypeCourse, TypeCoursesNames, TypeProject } from '@/types/project-type';
import Overlay from './Overlay';
import ListFooter from './ListFooter';
// import TypeLarge from '../layer2/TypeLarge';
import { ContextMenu } from '../context/ContextMenu';
import ListHeader from './ListHeader';
// import { render } from '@react-pdf/renderer';
import ListCourse from './ListCourse';
import Background from './Background';
import ListSVG from './ListSVG';

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

    // const [activeIndex, setActiveIndex] = useState<number|null>(null)
    // const doublicatedData = useMemo(() => [...cloneDeep(dataStudents), ...cloneDeep(dataStudents)], dataStudents)

    const [ready, setReady] = useState(false)

    const {
        screenHeight,
        screenWidth,
        rowHeight,
        // setActiveIndex,
        activeIndex 
     } = useContext(ContextMenu)


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

    const [firstIndex, setFirstIndex] = useState(0)

    useEffect(() => {

        const handleScroll = (e: any) => {

            const scrollInc = e.deltaY

            // const dir = Math.sign(scrollInc)

            const itemsToRemove = 1 + Math.floor(Math.abs(scrollInc)/10)
            // const itemsToRemove = 1 

            scrollPos.current = scrollInc+scrollPos.current

            const newOfst = ofst > 1000 ? 0 : ofst+Math.floor((Math.abs(scrollInc)/10))

            setOfst(newOfst)


            if(refContainer.current){


                if(scrollPos.current >= itemHeight){

                    scrollPos.current = 0
                    setFirstIndex((firstIndex+itemsToRemove) % dataStudents.length)

                }else if(scrollPos.current <= -itemHeight){

                    scrollPos.current = 0
                    setFirstIndex((firstIndex-itemsToRemove) % dataStudents.length)
                    
                }else{

                    // scrollPos.current = 0
                }
                // refContainer.current.scrollTop += 200
            }

            // 
            e.preventDefault()
        }

        window.addEventListener('wheel', handleScroll, { 
            passive: false
        })

        return () => {

            window.removeEventListener('wheel', handleScroll)
        }

    }, [ofst])


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
            
                <Overlay dataStudents={dataStudents} autoRotateSpeed={2}/>
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
            />
       </>
    )
}

export default List



