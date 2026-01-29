import { TypeProject } from '@/types/project-type'
import styles from './ProjectInfo.module.css'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { ContextMenu } from '../context/ContextMenu'

interface Props{
    project: TypeProject
}


const ProjectInfo = ({ project }:Props) => {



    const { fontSize } = useContext(ContextMenu)

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={styles.projectInfo} style={{
            transform: isOpen ? ``: `translateY(calc(-100% + 20px))`,
            fontSize: fontSize || ''
        }}>
            <ul className={styles.projectInfoList}>
        
                <li>{project.NAME}</li>
                <li></li>
                <li></li>
                <li></li>
                {/* <li><Link href={`/`}>{"<"} Go Back</Link></li> */}
                <li></li>
                {/*  */}
                <li></li>
                <li>{project["DEUTSCH"]}</li>
                <li></li>
                <li>{project["ENGLISH"]}</li>
                <li></li>
                {/*  */}
                <li></li>
                <li>{"DE"}</li>
                <li></li>
                <li></li>
                <li style={{ cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Open"} Info</li>
            </ul>

            <button style={{ cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Open"} Info</button>
            <Link href={`/`}>← Go Back</Link>

        </div>
    )
}

export default ProjectInfo