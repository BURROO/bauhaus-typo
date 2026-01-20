import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from './InfinityScroll.module.css'
import Link from 'next/link';
import { courseShort, TypeProject } from '@/types/project-type';
import Overlay from './Overlay';
import ListFooter from './ListFooter';
import TypeLarge from '../layer2/TypeLarge';
import { ContextMenu } from '../context/ContextMenu';

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



const getID = (item: TypeProject, nr: string) => {


    const pt1 = courseShort[item['Kurs']]
    
    const nameSplit = item["Studierende"].split(' ').map(char => char.charAt(0))

    const pt2 = `${nameSplit[0]}${nameSplit[nameSplit.length-1]}`


    return `${pt1}/${pt2}/${nr}`

}


const InfinityScroll = ({ data, setActiveIndex, activeIndex }: Props) => {

    const doublicatedData = useMemo(() => [...data, ...data], data)


    const { screenHeight } = useContext(ContextMenu)


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

    const [renderedData, setRenderedData] = useState(doublicatedData)

    const dataRef = useRef(renderedData)

    useEffect(() => {


        if(filter !== "" || searchTerm !== ''){
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

            const newOfst = ofst > 1000 ? 0 : ofst+Math.floor((Math.abs(scrollInc)/10))

            setOfst(newOfst)


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

    }, [ofst])



    const allCourses = new Set((data.map(item => item.Kurs)))

    // console.log("allCourses", allCourses)





    // const [rowHeight, setRowHeight] = useState(15)

    // useEffect(() => {
    //     // Read height and calc element based on height




    //     const handleResize = () => {
    //         const divider = Math.floor( screenHeight / 15)

    //         setRowHeight(window.innerHeight / divider)
    //     }

    //     handleResize()


    //     window.addEventListener("resize", handleResize)

    //     return () => {

    //         window.removeEventListener("resize", handleResize)
    //     }


    // }, [])

    // console.log("screenHeight", screenHeight)

    const divider = screenHeight !== null ? Math.floor( screenHeight / 15) :  1

    const rowHeight = screenHeight !== null ? (screenHeight / divider) : 0

    const name = activeIndex !== null && renderedData[activeIndex]?.Studierende || null

    return (
        <div
        className={styles.scrollWrapper}
        ref={refContainer}
        >
            <div
            className={styles.scrollWrapperInner}
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

                        const nr = (row.index).toString().padStart(2, "0")

                        const id = getID(row, nr)
                        // const id = hexEncode(row["Studierende"]).slice(0, 6)

                        const fieldIsTooLong = row["Studierende"].length > 20 || row["Title"].length > 20

                        return (
                            <Link 
                            key={i}
                            href={`/${kurs}/${studierende}`}
                            >
                                <li
                                className={styles.row}
                                // style={{ height: itemHeight }}
                                onMouseEnter={() => setActiveIndex(i)}
                                onMouseLeave={() => setActiveIndex(null)}
                                style={{
                                    height: fieldIsTooLong ? rowHeight*2 : rowHeight
                                    // opacity: activeIndex !== null && activeIndex !== i ? 0.6 : 1,
                                    // borderBottom: activeIndex !== i ? '1px solid transparent' : `1px solid white`,
                                    // borderTop: activeIndex !== i ? '1px solid transparent' : `1px solid white`
                                }}
                                >
                                    {/* NUMBER */}
                                    {/* <div className={i % 2 == 1 ? styles.rowGray : ''}>
                                        <span>{nr}</span>
                                    </div> */}
                                    {/* STUDENT */}
                                    <div className={i % 2 == 1 ? styles.rowGray : ''}>

                                            <span>{row["Studierende"]}</span>
                                    
                                        
                                    </div>
                                    {/* TITLE */}
                                    <div className={i % 2 == 1 ? styles.rowGray : ''}>
                                        <span>{row["Title"]}</span>
                                    </div>
                                    {/* MEDIUM */}
                                    <div className={courseIndex % 2 == 1 ? styles.rowGray : ''}>
                                        <span>{!isPrevSameCourse && (format[row["Kurs"]] || 'TBD') || ''}</span>
                                    </div>
                                    {/* FORMAT */}
                                    <div className={i % 2 == 1 ? styles.rowGray : ''}>
                                        <span>{row.Format}</span>
                                    </div>
                                    {/* COURSE */}
                                    <div className={courseIndex % 2 == 0 ? styles.rowGray : ''}>
                                        <span>{!isPrevSameCourse && row["Kurs"]}</span>
                                    </div>
                                    {/* SUPERVISION */}
                                    <div className={courseIndex % 2 == 1 ? styles.rowGray : ''}>
                                        <span>{!isPrevSameCourse && (supervision[row['Kurs']] || 'TBD') || ''}</span>
                                    </div>
                                    <div className={i % 2 == 1 ? styles.rowGray : ''}>
                                        <span>{id}</span>
                                        {/* {(row["Kurs"].split(" ").map((word: string) => word.charAt(0)))} */}
                                    </div>
                                </li>
                            </Link>
                        )
                    })
                }
                {
                    filter.length > 0 &&
                    <>
                        <li
                        className={styles.rowCourse}
                        // style={{ height: itemHeight }}
                        // onMouseEnter={() => setActiveIndex(i)}
                        // onMouseLeave={() => setActiveIndex(null)}
                        style={{
                            height: screenHeight ? (rowHeight * 3) : 0
                        }}
                        >
                            <div className={`${styles.rowGray}`}>
                                <br/>
                                <br/>
                                {filter}                               
                            </div>
                            {/* TITLE */}
                            <div className={``}>
                            </div>
                            {/* MEDIUM */}
                            <div className={``}>
                            </div>
                            {/* FORMAT */}
                            <div className={`${styles.rowGray}`}>
                            </div>
                            {/* COURSE */}
                            <div className={``}>
                            </div>
                            {/* SUPERVISION */}
                            <div className={``}>
                            </div>
                            <div className={``}>
                            </div>
                        </li>
                        <li
                        className={styles.rowCourse}
                        // style={{ height: itemHeight }}
                        // onMouseEnter={() => setActiveIndex(i)}
                        // onMouseLeave={() => setActiveIndex(null)}
                        style={{
                            height: screenHeight ? screenHeight - (rowHeight * renderedData.length - 3) : 0
                        }}
                        >
                            <div className={``}>                            
                            </div>
                            {/* TITLE */}
                            <div className={`${styles.rowGray}`}>
                                Text on current project       
                            </div>
                            {/* MEDIUM */}
                            <div className={`${styles.rowGray}`}>
                            </div>
                            {/* FORMAT */}
                            <div className={``}>
                            </div>
                            {/* COURSE */}
                            <div className={`${styles.rowGray}`}>
                            </div>
                            {/* SUPERVISION */}
                            <div className={`${styles.rowGray}`}>
                            </div>
                            <div className={``}>
                            </div>
                        </li>
                    </>
                }
            </ul>
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
                <div style={{ 
                    // transform: `translate(-100%, -100%) rotate(-90deg) `, 
                    // transform: `translate(-100%, -100%)`, 
                    // maxHeight: "58vh",
                    overflow: "hidden",
                    position: "fixed", 
                    lineHeight: 0.8,
                    // padding: `5vh 0 -10px 0`,
                    top: 0, 
                    left: 0,
                    width: "50vw",
                    height: "100vh", 
                    background: "black", 
                    // paddingLeft: "6vw",
                    // transform: `translateX(-50vw)`,
                    zIndex: -1,
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        // justifyContent: "center",
                        writingMode: "vertical-rl",
                        transform: `translate(-4%, calc(${-ofst/30}%)) rotate(180deg)`, 
                        fontSize: "65vw", 
                        padding: 0,
                        margin: 0,
                        fontFamily: `UfficioMono-Black`,
                        color: "white",
                        lineHeight: 1
                    }}>TYPOTYPOTYPO</div>
                </div>

            {/* <TypeLarge text={`Typography\\& Type Design\\${name ? `\\${name}` : ''}\\Exhibition\\6.–8.2.2026`} /> */}
           {/* <TypeLarge text={`Typography\\& Type Design\\§§§§§§§\\Exhibition\\06.–0.8.02.2026\\§§§§§\\${name ? `\\${name}` : ''}`} /> */}
            <svg width="0" height="0">
                <filter id="screenPrintEffect">
                    {/* <!-- Generate noise pattern --> */}
                    <feTurbulence type="turbulence" baseFrequency="0.95" numOctaves="3" result="turbulence"/>
                    
                    {/* <!-- Convert to grayscale and boost contrast --> */}
                    <feColorMatrix in="turbulence" type="matrix" values="0.33 0.33 0.33 0 0
                                                                        0.33 0.33 0.33 0 0
                                                                        0.33 0.33 0.33 0 0
                                                                        0 0 0 0.6 0" result="grayscale"/>
                    
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



