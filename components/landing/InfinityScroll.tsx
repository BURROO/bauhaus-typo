import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './InfinityScroll.module.css'
import Link from 'next/link';
import { TypeProject } from '@/types/project-type';
import Overlay from './Overlay';
import ListFooter from './ListFooter';
import { render } from '@react-pdf/renderer';

interface Props {
    data: TypeProject[];
    activeIndex: null|number;
    setActiveIndex: (value: number|null) => void;
}

interface Sorting {
    column: 'Name' | 'Title' | 'Course';
    direction: 'asc' | 'desc'
}

interface Filter {

}

const hexEncode = function(input: string){
    var hex, i;

    var result = "";
    for (i=0; i<input.length; i++) {
        hex = input.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}


const InfinityScroll = ({ data, setActiveIndex, activeIndex }: Props) => {

    const doublicatedData = useMemo(() => [...data, ...data], data)


    const scrollPos = useRef(2000)
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

    const [renderedData, setRenderedData] = useState(doublicatedData)

    console.log("renderData", renderedData.length)

    const dataRef = useRef(renderedData)

    useEffect(() => {


        if(filter !== "" || searchTerm !== ''){
        console.log("data", data.length)
            setRenderedData(
                data
                .filter(d => {

                    if(filter === "") return true


                    const found = Object.values(d).find(value => value && value.toString().match(new RegExp(filter, 'ig')))

                    return found
                })
                .filter(d => {

                    if(searchTerm === "") return true



                    const found = Object.values(d).find(value => value && value.toString().match(new RegExp(searchTerm, 'ig')))


                    console.log("filter by searchterm", searchTerm, found)
                    return found
                })
            )
        }else{
            setRenderedData(doublicatedData)
        }

    }, [filter, sorting, searchTerm, data])


    useEffect(() => {
        dataRef.current = renderedData
    }, [renderedData, refContainer.current])

    useEffect(() => {

        const handleScroll = (e: any) => {

            const scrollInc = e.deltaY

            // const dir = Math.sign(scrollInc)

            const itemsToRemove = 1 + Math.floor(Math.abs(scrollInc)/10)
            // const itemsToRemove = 1 

            scrollPos.current = scrollInc+scrollPos.current

            if(refContainer.current){

                if(scrollPos.current >= itemHeight){

                    // scrollPos.current -= itemHeight
                    scrollPos.current = 0

                    setRenderedData([
                        ...dataRef.current.slice(itemsToRemove, dataRef.current.length),
                        ...dataRef.current.slice(0, itemsToRemove)
                    ])
                }else if(scrollPos.current <= -itemHeight){
                    // scrollPos.current += itemHeight
                    scrollPos.current = 0
                    
                    setRenderedData([
                        // dataRef.current[dataRef.current.length-1],
                        ...dataRef.current.slice(dataRef.current.length-itemsToRemove, dataRef.current.length),
                        ...dataRef.current.slice(0, dataRef.current.length-itemsToRemove),
                    ])
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

    }, [])



    const allCourses = new Set((data.map(item => item.Kurs)))

    // console.log("allCourses", allCourses)




    const [rowHeight, setRowHeight] = useState(15)

    useEffect(() => {
        // Read height and calc element based on height




        const handleResize = () => {
            const divider = Math.floor(window.innerHeight / 15)

            setRowHeight(window.innerHeight / divider)
        }

        handleResize()


        window.addEventListener("resize", handleResize)

        return () => {

            window.removeEventListener("resize", handleResize)
        }


    }, [])


    return (
        <div
        className={styles.scrollWrapper}
        ref={refContainer}
        >
            <div
            className={styles.scrollWrapperInner}
            style={{ filter: `url(#screenPrintEffect)` }}
            />
            {
                activeIndex !== null &&
                <Overlay item={renderedData[activeIndex]} />
            }
            <ul 
            // style={{ paddingTop: rowHeight}}
            >
                <li
                className={`${styles.row} ${styles.header}`}
                style={{ height: rowHeight}}
                >
                    <div>Nr</div>
                    <div>Name</div>
                    <div>Title</div>
                    <div>Medium</div>
                    <div>Format</div>
                    <div>Course</div>
                    <div>Supervision</div>
                    <div>ID</div>
                </li>
                <li
                className={`${styles.row}`}
                style={{ height: rowHeight}}
                >
                    <div>Nr</div>
                    <div>Name</div>
                    <div>Title</div>
                    <div>Medium</div>
                    <div>Format</div>
                    <div>Course</div>
                    <div>Supervision</div>
                    <div>ID</div>
                </li>
                {
                    renderedData.map((row: any, i: number, all: any[]) => {


                        // const slug = row.

                        const kurs = row.Kurs.split(" ").map((w: string) => w.toLowerCase()).join("-")
                        const studierende = row.Studierende.split(" ").map((w: string) => w.toLowerCase()).join("-")
// 
                        // console.log(Array.from(allCourses))

                        const courseIndex = Array.from(allCourses).indexOf(row.Kurs)
                        const isPrevSameCourse = all[i-1]?.Kurs === row.Kurs

                        const supervision: { [key: string]: string} = {
                            'Transcoding Typography': 'Philipp Koller',
                            'In Order Of Meaning ': 'Marcel Saidov',
                            'Handmade Websites as Punk Zines': 'Hjördis Lyn Behncken & Insa Deist'
                        }

                        const format: { [key: string]: string} = {
                            'Transcoding Typography': 'Webtool',
                            'In Order Of Meaning ': 'Publication',
                            'Handmade Websites as Punk Zines': 'Website'
                        }

                        return (
                            <li
                            key={i}
                            className={styles.row}
                            // style={{ height: itemHeight }}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseLeave={() => setActiveIndex(null)}
                            style={{
                                height: rowHeight
                                // opacity: activeIndex !== null && activeIndex !== i ? 0.6 : 1,
                                // borderBottom: activeIndex !== i ? '1px solid transparent' : `1px solid white`,
                                // borderTop: activeIndex !== i ? '1px solid transparent' : `1px solid white`
                            }}
                            >
                                    {/* NUMBER */}
                                    <div className={i % 2 == 1 ? styles.rowGray : ''}>{(row.index).toString().padStart(2, "0")}</div>
                                    {/* STUDENT */}
                                    <div className={i % 2 == 0 ? styles.rowGray : ''}>

                                        <Link 
                                        href={`/${kurs}/${studierende}`}
                                      
                                        >
                                            <div>{row["Studierende"]}</div>
                                        </Link>
                                        
                                    </div>
                                    {/* TITLE */}
                                    <div className={i % 2 == 0 ? styles.rowGray : ''}>
                                        <div>{row["Title"]}</div>
                                    </div>
                                    {/* MEDIUM */}
                                    <div className={courseIndex % 2 == 1 ? styles.rowGray : ''}>
                                        {!isPrevSameCourse && (format[row["Kurs"]] || 'TBD') || ''}
                                    </div>
                                    {/* FORMAT */}
                                    <div className={i % 2 == 1 ? styles.rowGray : ''}>
                                       {row.Format}
                                    </div>
                                    {/* COURSE */}
                                    <div className={courseIndex % 2 == 0 ? styles.rowGray : ''}>
                                        <div>{!isPrevSameCourse && row["Kurs"]}</div>
                                    </div>
                                    {/* SUPERVISION */}
                                    <div className={courseIndex % 2 == 1 ? styles.rowGray : ''}>
                                        <div>{!isPrevSameCourse && (supervision[row['Kurs']] || 'TBD') || ''}</div>
                                    </div>
                                    <div className={i % 2 == 0 ? styles.rowGray : ''}>
                                        {hexEncode(row["Studierende"]).slice(0, 6)}
                                        {/* {(row["Kurs"].split(" ").map((word: string) => word.charAt(0)))} */}
                                    </div>
                            </li>
                        )
                    })
                }
            </ul>
    
            <ListFooter
            height={rowHeight*3}
            setFilter={setFilter}
            filter={filter}
            setSorting={setSorting}
            sorting={sorting}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            />
            <svg width="0" height="0">
                <filter id="screenPrintEffect">
                    {/* <!-- Generate noise pattern --> */}
                    <feTurbulence type="turbulence" baseFrequency="0.95" numOctaves="3" result="turbulence"/>
                    
                    {/* <!-- Convert to grayscale and boost contrast --> */}
                    <feColorMatrix in="turbulence" type="matrix" values="0.33 0.33 0.33 0 0
                                                                        0.33 0.33 0.33 0 0
                                                                        0.33 0.33 0.33 0 0
                                                                        0 0 0 0.8 0" result="grayscale"/>
                    
                    {/* <!-- Apply threshold to create sharp black/white dots --> */}
                    <feComponentTransfer in="grayscale" result="thresholded">
                    <feFuncA type="discrete" tableValues="0 1"/>
                    </feComponentTransfer>
                    
                    {/* <!-- Use the pattern as a mask or displacement map --> */}
                    <feComposite in="SourceGraphic" in2="thresholded" operator="in" result="screenPrinted"/>
                </filter>
            </svg>
        </div>
    )
}

export default InfinityScroll



