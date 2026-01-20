'use client'

import { useMemo, useState } from "react";
import InfinityScroll from './InfinityScroll'


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



    return (
        <InfinityScroll 
        data={sortedData} 
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        />
    )
}

export default List