'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import styles from './List.module.css'
import {  TypeCourse,TypeProject } from '@/types/project-type';
import Overlay from './Overlay';
import ListFooter from './ListFooter';
import { ContextMenu } from '../context/ContextMenu';
// import ListHeader from './ListHeader';
import ListCourse from './ListCourse';
import Background from './Background';
import ListSVG from './svg/ListSVG';
import { useSearchParams, useRouter } from 'next/navigation';

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

const List = ({ dataStudents, dataCourses}: Props) => {


    const searchParams = useSearchParams()
    const router = useRouter()

    const {
        screenHeight,
        rowHeight,
     } = useContext(ContextMenu)

    const scrollPos = useRef(2000)
    const [ofst, setOfst] = useState(0)
    const refContainer = useRef<HTMLDivElement>(null)

    // 
    // 
    const [sorting, setSorting ] = useState<Sorting>({
        column: 'Name',
        direction: 'asc'
    })

    // 
    const [searchTerm, setSearchTerm ] = useState("")

    const itemHeight = 60

    const [firstIndex, setFirstIndex] = useState(0)

    const [filter, setFilter ] = useState('')

        // Update URL when filter changes
    const updateFilter = (newFilter: string) => {
        setFilter(newFilter)

        // Build a new URLSearchParams object
        const params = new URLSearchParams(searchParams.toString())
        if (newFilter) {
        params.set('filter', newFilter)
        } else {
        params.delete('filter')
        }

        // Push a new URL (client-side navigation)
        router.push(`?${params.toString()}`)
    }
    
    useEffect(() => {
        const f = searchParams.get('filter') || ''
        setFilter(f)
    }, [searchParams])

    // useEffect(() => {

    //     const handleScroll = (e: any) => {

    //         const scrollInc = e.deltaY

    //         const itemsToRemove = 1 + Math.floor(Math.abs(scrollInc)/10)

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


    // const courseInfo: TypeCourse|null = dataCourses.find(k => k.COURSE === filter) || null
    const courseInfo: TypeCourse|null = dataCourses.find(k => k.COURSE.slice(0,7).match(filter.slice(0,7))) || null

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
                    course={courseInfo}
                    dataStudents={dataStudents}
                    // filter={filter}
                    />
                
                }
                <div className={styles.footer}>
                    <ListFooter
                    height={rowHeight*2}
                    setFilter={(filter) => {
                        updateFilter(filter)
                    }}
                    filter={filter}
                    // setSorting={setSorting}
                    setSearchTerm={setSearchTerm}
                    />
                </div>
                {/* <div 
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
                </div> */}
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



