
import { TypeCourse, TypeProject } from '@/types/project-type';
import styles from './ListCourse.module.css'

interface Props{
    screenHeight: number|null;
    rowHeight: number;
    course: TypeCourse|null;
    dataStudents: TypeProject[];
}

const ListCourse = ({ screenHeight, rowHeight, course, dataStudents }: Props) => {

    const studentsFromCourse = dataStudents.filter(student => student.COURSE === course?.COURSE)

    if(course === null || screenHeight === null) return <></>

    // console.log("course", screenHeight - rowHeight * renderedData.length, course)

    return (
        <div className={styles.listCourse}
        data-test="asfasf"
        style={{
            height: screenHeight - rowHeight * (studentsFromCourse.length+1)
        }}>

            <h2>{course.COURSE}</h2>
            <h3>{course.SUPERVISION}</h3>
            <br/>
            <div className={styles.text}>
                <div>
                    <p>{course['ENGLISH']}</p>
                </div>
                <div>
                    <p>{course['DEUTSCH']}</p>
                </div>
            </div>


            {/* <div
            className={styles.rowCourse}
            // style={{ height: itemHeight }}
            // onMouseEnter={() => setActiveIndex(i)}
            // onMouseLeave={() => setActiveIndex(null)}
            style={{
                height: screenHeight ? (rowHeight * 3) : 0
            }}
            >
            </div> */}
        </div>
    )
}


export default ListCourse