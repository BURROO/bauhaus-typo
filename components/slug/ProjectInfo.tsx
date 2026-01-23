import { TypeProject } from '@/types/project-type'
import styles from './ProjectInfo.module.css'
import Link from 'next/link'
import { useState } from 'react'

interface Props{
    project: TypeProject
}


const ProjectInfo = ({ project }:Props) => {

    const [isOpen, setIsOpen] = useState(false)


    return (
        <div className={styles.projectInfo} style={{
            transform: isOpen ? ``: `translateY(calc(100% - 20px))`
        }}>
            <ul className={styles.projectInfoList}>
                {/* <li></li>
                <li>asf</li>
                <li></li>
                <li></li> */}
                <li>{project.Studierende}</li>
                <li></li>
                <li></li>
                <li></li>
                {/* <li><Link href={`/`}>{"<"} Go Back</Link></li> */}
                <li style={{ cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Open"} Info</li>
                {/*  */}
                <li></li>
                <li>{project["Text DE"]}</li>
                <li></li>
                <li>{project["Text EN"]}</li>
                <li></li>
                {/*  */}
                <li></li>
                <li>{"DE"}</li>
                <li></li>
                <li></li>
                <li></li>
            </ul>

        </div>
    )
}

export default ProjectInfo