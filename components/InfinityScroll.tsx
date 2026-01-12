import { useEffect, useRef, useState } from 'react'
import styles from './InfinityScroll.module.css'
import Link from 'next/link';
import { TypeProject } from '@/types/project-type';

interface Props {
    data: TypeProject[];
    activeIndex: null|number;
    setActiveIndex: (value: number|null) => void;
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

            console.log("handle scroll", scrollPos.current)

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



    return (
        <div className={styles.scrollWrapper} ref={refContainer}>
            <ul 
            style={{
                // transform: `translate(0, calc(50vh - 50%))`
            }}>
                {
                    renderedData.map((row: any, i: number, all: any[]) => {


                        // const slug = row.

                        const kurs = row.Kurs.split(" ").map((w: string) => w.toLowerCase()).join("-")
                        const studierende = row.Studierende.split(" ").map((w: string) => w.toLowerCase()).join("-")

                        // console.log(row)


                        return (
                            <li
                            key={i}
                            className={styles.row}
                            // style={{ height: itemHeight }}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseLeave={() => setActiveIndex(null)}
                            style={{
                                opacity: activeIndex !== null && activeIndex !== i ? 0.6 : 1,
                                borderBottom: activeIndex !== i ? '1px solid transparent' : `1px solid white`,
                                borderTop: activeIndex !== i ? '1px solid transparent' : `1px solid white`
                            }}
                            >
                                    <div>{row.index}</div>
                                    <div>

                                        <Link 
                                        href={`/${kurs}/${studierende}`}
                                      
                                        >
                                            <div>{row["Studierende"]}</div>
                                        </Link>
                                        
                                    </div>
                                    <div>
                                        <div>{row["Title"]}</div>
                                    </div>
                                    <div>
                                        <div><i>{row["Kurs"]}</i></div>
                                    </div>
                                    <div>
                                        {row["Kurs"].split(" ").map((word: string) => word.charAt(0))}
                                    </div>
                            </li>
                        )
                    })
                }
            </ul>
            {
                activeIndex !== null &&
                <Overlay activeIndex={activeIndex} item={renderedData[activeIndex]} />
            }
        </div>
    )
}

export default InfinityScroll


const Overlay = ({ activeIndex, item }: {activeIndex: number; item: any; }) => {

    // const x = Math.sin(activeIndex) 
    // const y = Math.cos(activeIndex)

    // const xTrans = `calc(${x} * (50vw - 150px) - 50%)`
    // const yTrans = `calc(${y} * (50vh - 150px) - 50%)`

    // renderedData
    // console.log("item", item.Image)

    return (
            <div 
            className={styles.overlay}
            >
                <img
                src={`images/${item.Image}`}
              />
            </div>
    )
}