
import { TypeProject } from '@/types/project-type';
import styles from './ListCourse.module.css'

interface Props{
    screenHeight: number|null;
    rowHeight: number;
    filter: string;
    renderedData: TypeProject[];
}

const ListCourse = ({ screenHeight, rowHeight, filter , renderedData}: Props) => {


    return (
        <li className={styles.listCourse}>
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
                <div className={styles.rowGray}>                       
                </div>
                {/* TITLE */}
                <div className={styles.rowGray}>
                    Text on current project       
                </div>
                {/* MEDIUM */}
                <div className={styles.rowGray}>
                </div>
                {/* FORMAT */}
                <div className={styles.rowGray}>
                </div>
                {/* COURSE */}
                <div className={styles.rowGray}>
                </div>
                {/* SUPERVISION */}
                <div className={styles.rowGray}>
                </div>
                <div className={styles.rowGray}>
                </div>
            </li>
        </li>
    )
}


export default ListCourse