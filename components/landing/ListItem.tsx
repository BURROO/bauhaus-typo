
import styles from './ListItem.module.css'
import Link from 'next/link';
import { courseShort, TypeCoursesNames, TypeProject } from '@/types/project-type';
import { sanitizeForUrl } from '@/util/sanitizeForUrl';

interface Props {
    row: TypeProject;
    all: TypeProject[];
    allCourses: Set<TypeCoursesNames>;
    currentIndex: number;
    activeIndex: number|null;
    setActiveIndex: (index: number|null ) => void;
    rowHeight: number;
    // activeIndex: null|number;
    // setActiveIndex: (value: number|null) => void;
}

const ListItem = ({
    row,
    all,
    allCourses,
    currentIndex,
    activeIndex,
    setActiveIndex,
    rowHeight
}: Props) => {

    const activeElement = activeIndex && all[activeIndex]

    const kurs = sanitizeForUrl(row.COURSE)
    const studierende = sanitizeForUrl(row.NAME)

    const courseIndex = Array.from(allCourses).indexOf(row.COURSE)
    const isPrevSameCourse = all[currentIndex-1]?.COURSE === row.COURSE
    const isPrevSameFormat = all[currentIndex-1]?.FORMAT === row.FORMAT
    const isPrevSameMedium = all[currentIndex-1]?.MEDIUM === row.MEDIUM

    // const nr = (row.index).toString().padStart(2, "0")

    // const id = getID(row, nr)

    const fieldIsTooLong = row["NAME"].length > 20 || row["TITLE"].length > 20

    const isActive = activeIndex === currentIndex
    const isActiveCourse = activeElement && activeElement.COURSE === row.COURSE || false
    const isActiveSupervision = activeElement && activeElement.SUPERVISION === row.SUPERVISION || false

    return (
        <Link 
        href={`/${kurs}/${studierende}`}
        >
            <li
            className={styles.row}
            // style={{ height: itemHeight }}
            onMouseEnter={() => setActiveIndex(currentIndex)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{
                opacity: 0,
                // background: isActiveCourse ? "red" : "",
                height: fieldIsTooLong ? rowHeight*2 : rowHeight
                // opacity: activeIndex !== null && activeIndex !== currentIndex ? 0.6 : 1,
                // borderBottom: activeIndex !== currentIndex ? '1px solid transparent' : `1px solid white`,
                // borderTop: activeIndex !== currentIndex ? '1px solid transparent' : `1px solid white`
            }}
            >
                {/* NUMBER */}
                <Column isGray={currentIndex % 2 == 1} isActive={isActive} content={row["NAME"]} />
                {/* TITLE */}
                <Column isGray={currentIndex % 2 == 1} isActive={isActive} content={row["TITLE"]} />
                {/* MEDIUM */}
                <Column isGray={courseIndex % 2 == 1} isActive={isActiveCourse} content={!isPrevSameMedium && row["MEDIUM"] || ""} />
                {/* FORMAT */}
                <Column isGray={currentIndex % 2 == 1} isActive={isActive} content={row["FORMAT"]} />
                {/* COURSE */}
                <Column isGray={courseIndex % 2 == 0} isActive={isActiveCourse} content={!isPrevSameCourse && row["COURSE"] || ''}/>
                {/* <div className={courseIndex % 2 == 0 ? styles.rowGray : ''}>
                    <span>{!isPrevSameCourse && row["COURSE"]}</span>
                </div> */}
                {/* SUPERVISION */}
                <Column isGray={courseIndex % 2 == 1} isActive={isActiveSupervision} content={!isPrevSameCourse && (row['SUPERVISION'] || 'TBD') || ''} />
                {/* <div className={(courseIndex % 2 == 11 ) ? styles.rowGray : ''}></div>
                    <span>{!isPrevSameCourse && (supervision[row['Kurs']] || 'TBD') || ''}</span>
                </div> */}
                <Column isGray={courseIndex % 2 == 1} isActive={isActive} content={row.ID} />
                {/* <div className={currentIndex % 2 == 1 ? styles.rowGray : ''}>
                    <span>{id}</span>
                </div> */}
            </li>
        </Link>
    )
}



const Column = ({ isGray, content, isActive}: { isGray: boolean; content: string; isActive?: boolean }) => {


    return (
        <div className={isActive ? styles.isActive : (isGray ? styles.rowGray : '')}>
            {/* <span> */}
                {content}
                {/* </span> */}
        </div>

    )
}



export default ListItem



