import { TypeProject } from '@/types/project-type'
import styles from './ProjectInfo.module.css'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { ContextMenu } from '../context/ContextMenu'
import ListSVGOneRow from '../landing/svg/ListSVGOneRow'
import ButtonLink from '../general/ButtonLink'

interface Props{
    project: TypeProject
}

const ProjectInfo = ({ project }:Props) => {

    const { fontSize: size } = useContext(ContextMenu)

    const fontSize = size || 0

    const [isOpen, setIsOpen] = useState(false)

    const { rowHeight } = useContext(ContextMenu)

    return (
        <div 
        className={styles.projectInfo} 
        // style={{ display: "flex", flexDirection: "column"}}
        >
            <div 
            className={styles.projectInfoInner} 

            onClick={() => setIsOpen(!isOpen)}
            style={{
                paddingBottom: rowHeight || 0,
            }}
            >
                <div
                className={styles.header} 
                style={{ 
                    height: rowHeight || 0
                    // height: isOpen ? "30vh" : rowHeight || 0
                }}>
                    <ul style={{ display: "grid", fontSize }}>
                        <li style={{ fontSize }}>{project.NAME}</li>
                        <li style={{ fontSize }}>{project.TITLE}</li>
                        {/* <li style={{ fontSize }}>{project.MEDIUM}</li>
                        <li style={{ fontSize }}>{project.FORMAT}</li> */}
                        <li style={{ fontSize }}>{project.COURSE}</li>
                        <li style={{ fontSize }}>{project.SUPERVISION}</li>
                        <li style={{ fontSize }}>{project.ID}</li>
                    </ul>
                </div>
                <div 
                className={styles.dropDown} 
                onClick={() => !isOpen && setIsOpen(!isOpen)}
                style={{
                    fontSize,
                }}>                    
                    <div
                    className={styles.dropDownBG} 
                    />
                    <div
                    className={styles.dropDownInner} 
                    style={{
                        display: isOpen ? "" : "none",
                    }}>
                        <div style={{
                        fontSize: fontSize || '',
                   
                    }}>
                            <p>{project["DEUTSCH"]}</p>
                            <br/>
                            <p>{project["ENGLISH"]}</p>
                        </div>
                    </div>


                </div>
                <ButtonLink href="/" text='Go Back' />
            </div>
        
        </div>
    )
}

export default ProjectInfo