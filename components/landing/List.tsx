'use client'

import { useEffect, useMemo, useState } from "react";
import styles from './List.module.css'
import InfinityScroll from './InfinityScroll'
import TypeLarge from "../layer2/TypeLarge";


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

        return [...sortedData]
    }, [data])




    // console.log("sortedData", sortedData.length)
    // console.log("sortedData", sortedData)

    return (
        <div className={styles.list}>
            <InfinityScroll 
            data={sortedData} 
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            />
            <TypeLarge text={`Typography & Type Design\\Exhibition\\06.–0.8.02.2026`} />
           {/* {activeIndex === null && 
           <TypeLarge text={`Typography & Type Design\\Exhibition\\06.–0.8.02.2026`} />} */}
        </div>
    )
}

export default List