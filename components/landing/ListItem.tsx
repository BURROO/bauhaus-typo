
import styles from './ListItem.module.css'
import Link from 'next/link';
import { courseShort, TypeCourses, TypeProject } from '@/types/project-type';

interface Props {
    row: TypeProject;
    all: TypeProject[];
    allCourses: Set<TypeCourses>;
    currentIndex: number;
    activeIndex: number|null;
    setActiveIndex: (index: number|null ) => void;
    rowHeight: number;
    // activeIndex: null|number;
    // setActiveIndex: (value: number|null) => void;
}


const getID = (item: TypeProject, nr: string) => {


    const pt1 = courseShort[item['Kurs']]
    
    const nameSplit = item["Studierende"].split(' ').map(char => char.charAt(0))

    const pt2 = `${nameSplit[0]}${nameSplit[nameSplit.length-1]}`


    return `${pt1}/${pt2}/${nr}`

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

    // const slug = row.
    const kurs = row.Kurs.split(" ").map((w: string) => w.toLowerCase()).join("-")
    const studierende = row.Studierende.split(" ").map((w: string) => w.toLowerCase()).join("-")

    const courseIndex = Array.from(allCourses).indexOf(row.Kurs)
    const isPrevSameCourse = all[currentIndex-1]?.Kurs === row.Kurs

    const supervision: { [key: string]: string} = {
        'Transcoding Typography': 'Philipp Koller',
        'In Order Of Meaning ': 'Marcel Saidov',
        'Handmade Websites as Punk Zines': 'Hjördis Lyn Behncken & Insa Deist'
    }

    const format: { [key: string]: string} = {
        'Transcoding Typography': 'Webtool',
        'In Order Of Meaning ': 'Publication',
        'Handmade Websites as Punk Zines': 'Website'
    }

    const nr = (row.index).toString().padStart(2, "0")

    const id = getID(row, nr)
    // const id = hexEncode(row["Studierende"]).slice(0, 6)

    const fieldIsTooLong = row["Studierende"].length > 20 || row["Title"].length > 20


    const isActive = activeIndex === currentIndex
    const isActiveCourse = activeElement && activeElement.Kurs === row.Kurs || false
    const isActiveSupervision = activeElement && activeElement.Supervision === row.Supervision || false

    // console.log((activeElement?.Kurs === row.Kurs).toString(), activeElement?.Kurs, row.Kurs)

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
                // background: isActiveCourse ? "red" : "",
                height: fieldIsTooLong ? rowHeight*2 : rowHeight
                // opacity: activeIndex !== null && activeIndex !== currentIndex ? 0.6 : 1,
                // borderBottom: activeIndex !== currentIndex ? '1px solid transparent' : `1px solid white`,
                // borderTop: activeIndex !== currentIndex ? '1px solid transparent' : `1px solid white`
            }}
            >
                {/* NUMBER */}
                <Column isGray={currentIndex % 2 == 1} isActive={isActive} content={row["Studierende"]} />
                {/* TITLE */}
                <Column isGray={currentIndex % 2 == 1} isActive={isActive} content={row["Title"]} />
                {/* MEDIUM */}
                <Column isGray={courseIndex % 2 == 1} isActive={isActiveCourse} content={!isPrevSameCourse && (format[row["Kurs"]]) || ''} />
                {/* FORMAT */}
                <Column isGray={currentIndex % 2 == 1} isActive={isActive} content={row["Format"]} />
                {/* COURSE */}
                <Column isGray={courseIndex % 2 == 0} isActive={isActiveCourse} content={!isPrevSameCourse && row["Kurs"] || ''}/>
                {/* <div className={courseIndex % 2 == 0 ? styles.rowGray : ''}>
                    <span>{!isPrevSameCourse && row["Kurs"]}</span>
                </div> */}
                {/* SUPERVISION */}
                {/* <Column isGray={courseIndex % 2 == 1} isActive={isActiveSupervision} content={!isPrevSameCourse && (supervision[row['Kurs']] || 'TBD') || ''} /> */}
                <Column isGray={courseIndex % 2 == 1} isActive={isActiveSupervision} content={!isPrevSameCourse && (row['Supervision'] || 'TBD') || ''} />
                {/* <div className={(courseIndex % 2 == 11 ) ? styles.rowGray : ''}></div>
                    <span>{!isPrevSameCourse && (supervision[row['Kurs']] || 'TBD') || ''}</span>
                </div> */}
                <Column isGray={courseIndex % 2 == 1} isActive={isActive} content={id} />
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



