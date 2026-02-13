import {TypeCoursesNames } from '@/types/project-type';
import styles from './ListFooter.module.css'
import { useContext } from 'react';
import { ContextMenu } from '../context/ContextMenu';


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


    const filterOptions: { short: 'TT' | 'OM' | 'PZ' | 'TG'; name: TypeCoursesNames }[] = [
        { short: "TT", name: "Transcoding Typography" }, 
        { short: "OM", name: "In Order Of Meaning" }, 
        { short: "PZ", name: "Handmade Websites as Punk Zines" },
        // { short: "TG", name: '204 Type-Gazette Issue 6' },
        // { short: "TG", name: '204 Type-Gazette Issue 06' },
    ]

    return (
        <div
        className={styles.footer}
        style={{ 
            height,
            fontSize: fontSize || ''
         }}
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
            <div style={{ display: "flex"}}>
                <div style={{ display: "flex"}}> 
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
                <div>
                    <button>About</button>
                    <button>Imprint</button>
                </div>
            </div>
        </div>

    )
}

export default ListFooter