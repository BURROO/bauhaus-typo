
import { TypeCourse, TypeProject } from '@/types/project-type';
import styles from './ListCourse.module.css'
import { useContext } from 'react';
import { ContextMenu } from '../context/ContextMenu';

interface Props{
    course: TypeCourse|null;
    dataStudents: TypeProject[];
}

const ListCourse = ({ course, dataStudents }: Props) => {

    const {
        screenHeight,
        rowHeight,
     } = useContext(ContextMenu)


    //  @ts-ignore
    const studentsFromCourse = dataStudents.filter(student => student.COURSE.match(course?.COURSE))

    const count = studentsFromCourse.reduce((acc, data) => acc + data.NAME.split(',').length, 0)

    if(course === null || screenHeight === null || !rowHeight) return <></>

    return (
        <div className={styles.listCourse}
        data-test="asfasf"
        style={{
            height: screenHeight - rowHeight * (count+1)
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
        </div>
    )
}


export default ListCourse