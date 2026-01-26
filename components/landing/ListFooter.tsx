import styles from './ListFooter.module.css'




interface Sorting {
    column: 'Name' | 'Title' | 'Course';
    direction: 'asc' | 'desc'
}

interface Props {
    setFilter: (value: string) => void;
    filter: string;
    setSorting: (value: any) => void;
    sorting: Sorting
    setSearchTerm: (value: string) => void;
    searchTerm: string;
    height: number;
}

const ListFooter = ({ setFilter, filter, setSorting, sorting, setSearchTerm, searchTerm, height }: Props) => {


    return (
        <div
        className={styles.footer}
        style={{ height }}
        >
            <div>Search: <input type="text" onChange={(e) => setSearchTerm(e.currentTarget.value)}></input></div>
            <div style={{ display: "flex"}}>
                <span>Filter:</span>
                {
                    [
                        { short: "TT", name: "Transcoding Typography" }, 
                        { short: "OM", name: "In Order Of Meaning" }, 
                        { short: "PZ", name: "Handmade Websites as Punk Zines" },
                        // { short: "FP", name: "Free Project" }
                    ].map((course, i, allCourses) => (
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
        </div>

    )
}

export default ListFooter