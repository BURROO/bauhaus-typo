import { useEffect, useRef, useState } from 'react'
import styles from './InfinityScroll.module.css'
import Link from 'next/link';
import { TypeProject } from '@/types/project-type';

interface Props {
    data: TypeProject[];
    activeIndex: null|number;
    setActiveIndex: (value: number|null) => void;
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


    const scrollPos = useRef(2000)
    const refContainer = useRef<HTMLDivElement>(null)

    const itemHeight = 60

    const [renderedData, setRenderedData] = useState([...data, ...data, ...data])


    const dataRef = useRef(renderedData)


    useEffect(() => {
        dataRef.current = renderedData
        // if(refContainer.current) refContainer.current.scrollTop = scrollPos.current
        // if(refContainer.current) refContainer.current.scrollTo({
        //     top: scrollPos.current,
        //     behavior: 'smooth'
        // })
    }, [renderedData, refContainer.current])

    useEffect(() => {

        const handleScroll = (e: any) => {


            const scrollInc = e.deltaY*2

            scrollPos.current = scrollInc+scrollPos.current

            if(refContainer.current){

                if(scrollPos.current >= itemHeight){

                    // scrollPos.current -= itemHeight
                    scrollPos.current = 0

                    setRenderedData([
                        ...dataRef.current.slice(1, dataRef.current.length),
                        dataRef.current[0]
                    ])
                }else if(scrollPos.current <= -itemHeight){
                    // scrollPos.current += itemHeight
                    scrollPos.current = 0
                    
                    setRenderedData([
                        dataRef.current[dataRef.current.length-1],
                        ...dataRef.current.slice(0, dataRef.current.length-1),
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

    console.log("allCourses", allCourses)


    return (
        <div className={styles.scrollWrapper} ref={refContainer}>
            {
                // activeIndex !== null &&
                <Overlay activeIndex={1} item={renderedData[1]} />
            }
            <ul>
                <li
                className={styles.row}
                style={{ 
                    position: "fixed",
                    background: "black",
                    color: "white",
                    zIndex: 10,
                    left: 0,
                    right: 0,
                    textTransform: "uppercase"
                }}> 
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

                        // console.log("courseIndex", courseIndex)
                        const supervision: { [key: string]: string} = {
                            'Transcoding Typography': 'Philipp Koller',
                            'In Order Of Meaning': 'Marcel Saidov',
                            'Punk Zine': 'Hjördis Lyn Behncken & Insa Deist'
                        }

                        const format: { [key: string]: string} = {
                            'Transcoding Typography': 'Webtool',
                            'In Order Of Meaning': 'Publication',
                            'Punk Zine': 'Website'
                        }

                        return (
                            <li
                            key={i}
                            className={styles.row}
                            // style={{ height: itemHeight }}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseLeave={() => setActiveIndex(null)}
                            style={{
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
                                    <div className={courseIndex % 2 == 1 ? styles.rowGray : ''}>
                                        X
                                    </div>
                                    {/* COURSE */}
                                    <div className={courseIndex % 2 == 0 ? styles.rowGray : ''}>
                                        <div>{!isPrevSameCourse && row["Kurs"]}</div>
                                    </div>
                                    {/* SUPERVISION */}
                                    <div className={i % 2 == 0 ? styles.rowGray : ''}>
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
        </div>
    )
}

export default InfinityScroll




const thumbnails: { [key: string]: string } = {
    'Yuqing Liu': `yuqing_liu_thumbnail.mov`,
    'Alice Aydin': `alice_aydin_thumbnail.mp4`,
    'Florian Meisner': `helene_dennewitz_thumbnail.gif`,
    'Helene Dennewitz': `florian_meisner_thumbnail.mp4`,
    'Sophia Boni': `sofia_boni_thumbnail.mp4`, // Falsch geschrieben!! --> Sofia!
    'Difei Song': `difei_song_thumbnail.mp4`,
    'Yu Ji': `yu_ji_thumbnail.mp4`,
}


const Overlay = ({ activeIndex, item }: {activeIndex: number; item: any; }) => {

    const img = thumbnails[item.Studierende] && `/images/tt/${thumbnails[item.Studierende]}` || `/images/tt/florian_meisner_thumbnail.gif`

    const split = img.split(".")
    const type = split.pop()
    const isMovie = type?.match(/mov|mp4/ig)
    // console.log("type", type)


    return (
            <div 
            className={styles.overlay}
            >
                {
                    isMovie ?
                    <video
                    src={img}
                    autoPlay
                    loop
                    />
                    :
                    <img
                    src={img}
                    />

                }
            </div>
    )
}