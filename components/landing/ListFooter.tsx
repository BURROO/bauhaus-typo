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
    searchTerm: string
}

const ListFooter = ({ setFilter, filter, setSorting, sorting, setSearchTerm, searchTerm }: Props) => {


    return (
        <div
        className={styles.footer}
        >
            <div>Search: <input type="text" onChange={(e) => setSearchTerm(e.currentTarget.value)}></input></div>
            <div style={{ display: "flex"}}>
                Filter:
                {
                    [
                        "Transcoding Typography", 
                        "In Order Of Meaning", 
                        "Handmade Websites as Punk Zines",
                        "Free Project"
                    ].map((course, i, allCourses) => (
                        <span 
                        onClick={(() => setFilter(course === filter ? "" : course))}
                        key={i}
                        className={`${styles.tag} ${course === filter ? styles.active : ''}`}
                        >
                            {course}
                        </span>
                    ))
                }    
            </div>
        </div>

    )
}

export default ListFooter