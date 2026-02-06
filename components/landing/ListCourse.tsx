
import { TypeCourse, TypeProject } from '@/types/project-type';
import styles from './ListCourse.module.css'
import { useContext } from 'react';
import { ContextMenu } from '../context/ContextMenu';
import { getLinesPerRow, getTotalLinesForListOfPojects } from '@/util/handleNameSplitting';

interface Props{
    course: TypeCourse|null;
    dataStudents: TypeProject[];
}

const ListCourse = ({ course, dataStudents }: Props) => {

    const {
        screenHeight,
        rowHeight,
        fontSize
     } = useContext(ContextMenu)


    //  @ts-ignore
    const studentsFromCourse = dataStudents.filter(student => student.COURSE.match(course?.COURSE))

    // const count = studentsFromCourse.reduce((acc, data) => {
        

    //     // const titleLength = data.TITLE.split(':').length
    //     // const nameLength = data.NAME.split(',').length

    //     // console.log(data.TITLE, "titleLength ", titleLength)
        
    //     // const length = Math.max(titleLength, nameLength)

    //     const length = getLinesPerRow({ project: data})
        
    //     return acc + length
    // }, 0)

    const count = getTotalLinesForListOfPojects({ projects: studentsFromCourse })

    if(course === null || screenHeight === null || !rowHeight) return <></>

    return (
        <div className={styles.listCourse}
        data-test="asfasf"
        style={{
            height: screenHeight - rowHeight * (count),
            fontSize: fontSize || ''
        }}>

            <h2
            style={{
                fontSize: fontSize || ''
            }}
            >{course.COURSE}</h2>
            <h3
            style={{
                fontSize: fontSize || ''
            }}>{course.SUPERVISION}</h3>
            <br/>
            <div className={styles.text}>
                <div>
                    <p>{course['ENGLISH']}</p>
                </div>
                <div>
                    <p>{course['DEUTSCH']}</p>
                </div>
            </div>
        </div>
    )
}


export default ListCourse