'use client'

import { useEffect, useMemo, useState } from "react";
import styles from './List.module.css'
import InfinityScroll from './InfinityScroll'
import TypeLarge from "./TypeLarge";


interface Props {
    data: any[];
}


const List = ({ data }: Props) => {

    const [activeIndex, setActiveIndex] = useState<number|null>(null)

    const sortedData = useMemo(() => {
        
        const sortedData = data
        // .sort((a, b) => b["Studierende"]?.localeCompare(a["Studierende"]) )
        .filter((item: any) => {

            if(typeof item["Studierende"] === "undefined") return false

            return true
        })
        .map((d, i) => ({ ...d, index: i }))

        return [...sortedData, ...sortedData]
    }, [data])


    const [showIntro, setShowIntro] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => {

            setShowIntro(false)

        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [])


    return (
        <div className={styles.list}>
            <InfinityScroll 
            data={sortedData} 
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            />
           {showIntro && <TypeLarge text={`Typography & Type Design`} />}
        </div>
    )
}

export default List