import {TypeCoursesNames } from '@/types/project-type';
import styles from './ListFooter.module.css'
import { useContext, useState } from 'react';
import { ContextMenu } from '../context/ContextMenu';
import Link from 'next/link';


// interface Sorting {
//     column: 'Name' | 'Title' | 'Course';
//     direction: 'asc' | 'desc'
// }

interface Props {
    setFilter: (value: string) => void;
    filter: string;
    // setSorting: (value: any) => void;
    // sorting: Sorting
    setSearchTerm: (value: string) => void;
    // searchTerm: string;
    height: number;
}

const ListFooter = ({
    setFilter,
    filter,
    // setSorting,
    // sorting,
    setSearchTerm,
    // searchTerm,
    height 
}: Props) => {


    const { fontSize } = useContext(ContextMenu)

    const [isInfoOpen, setIsInfoOpen] = useState(false)

    const filterOptions: { short: 'TT' | 'OM' | 'PZ' | 'TG'; name: TypeCoursesNames }[] = [
        { short: "TT", name: "Transcoding Typography" }, 
        { short: "OM", name: "In Order Of Meaning" }, 
        { short: "PZ", name: "Handmade Websites as Punk Zines" },
        // { short: "TG", name: '204 Type-Gazette Issue 6' },
        // { short: "TG", name: '204 Type-Gazette Issue 06' },
    ]

    

    return (
        <>
            <div
            className={styles.footer}
            style={{ 
                height,
                fontSize: fontSize || ''
            }}
            >
                <div
                className={styles.footerItem}
                >
                    <div>
                        <label>
                        Search: <input
                        style={{
                            fontSize: fontSize || ''
                        }}
                        type="text" 
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        ></input>
                        </label>
                    </div>
                    <span>Course:</span>
                    {
                        filterOptions.map((course, i, allCourses) => (
                            <span 
                            onClick={(() => setFilter(course.name === filter ? "" : course.name))}
                            key={i}
                            className={`${styles.tag} ${course.name === filter ? styles.active : ''}`}
                            >
                                {course.name !== filter ? course.short : course.name}
                            </span>
                        ))
                    }    
                </div>
                <div className={styles.footerItem} >
                    <button 
                    style={{
                        fontSize: fontSize || ''
                    }}
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    >About</button>
                    {/* <button>Imprint</button> */}
                    <Link
                    style={{
                        fontSize: fontSize || ''
                    }}
                    href={`/imprint`}
                    >Imprint</Link>
                </div>
            </div>

            {isInfoOpen && <div className={styles.overlayInfo} onClick={() => setIsInfoOpen(!isInfoOpen)}>

                <div className={styles.overlayInfoText} onClick={(e) => { e.stopPropagation() }}>
                    <h2 style={{ fontSize: fontSize || '' }}>
                        EXHIBITION TYPOGRAPHY & TYPE DESIGN
                    </h2>
                    <br/>
                    <p style={{ fontSize: fontSize || '' }}>
                        The exhibition of the Typography & Type Design department (@bauhaus.typography) at Bauhaus-Universität Weimar presents student work from the WinterSemester 2025/2026. This year extending into the digital space. Websites, tools, and publications are now accessible online.
                    </p>

                    <div 
                    style={fontSize ? { width: fontSize*1.2, height: fontSize*1.2 } : {}} 
                    className={styles.close}
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    >
                        <div/><div/>
                    </div>
                </div>
            </div>}
        </>

    )
}

export default ListFooter