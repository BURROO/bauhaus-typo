
import { TypeCourse, TypeProject } from '@/types/project-type';
import styles from './ListCourse.module.css'

interface Props{
    screenHeight: number|null;
    rowHeight: number;
    course: TypeCourse|null;
    renderedData: TypeProject[]
}

const ListCourse = ({ screenHeight, rowHeight, course, renderedData }: Props) => {


    if(course === null || screenHeight === null) return <></>

    console.log("course", screenHeight - rowHeight * renderedData.length, course)

    return (
        <div className={styles.listCourse}
        data-test="asfasf"
        style={{
            height: screenHeight - rowHeight * (renderedData.length+1)
        }}>

            <h2>{course.Kurs}</h2>
            <h3>{course.Supervision}</h3>
            <br/>
            <div className={styles.text}>
                <div>
                    <p>{course['Text EN']}</p>
                </div>
                <div>
                    <p>{course['Text DE']}</p>
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