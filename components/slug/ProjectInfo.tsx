import { TypeProject } from '@/types/project-type'
import styles from './ProjectInfo.module.css'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { ContextMenu } from '../context/ContextMenu'
import ListSVGOneRow from '../landing/svg/ListSVGOneRow'

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
            onClick={() => setIsOpen(!isOpen)}
            style={{
                position: "relative",
                top: 0,
                left: 0,
                cursor: "pointer",
                zIndex: isOpen ? 1 : 0,
                paddingBottom: rowHeight || 0,
            }}
            >
                <div style={{ 
                    backdropFilter: "blur(20px)", 
                    // opacity: 0.9, 
                    background: "rgba(200,200,200,0.7)",
                    fontSize: 0,
                    padding: 0,
                    margin: 0,
                    height: isOpen ? "50vh" : rowHeight || 0
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
                onClick={() => !isOpen && setIsOpen(!isOpen)}
                style={{
                    position: "absolute",
                    fontSize,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    maxWidth: 800
                }}>
                    <div style={{
                        display: isOpen ? "" : "none",
                        position: "relative",
                        fontSize: 0,
                        margin: 0,
                        textTransform: "uppercase",
                        padding: `100px 4px 0 4px`,
                    }}>
                        <div style={{
                        fontSize: fontSize || '',
                   
                    }}>
                            <p>{project["DEUTSCH"]}</p>
                            <br/>
                            <p>{project["ENGLISH"]}</p>
                        </div>

                        {/* <div>
                            <button style={{ cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Open"} Info</button>
            
                        </div>

                        <button style={{ cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Open"} Info</button> */}
                    </div>
                    <Link href={`/`}>
                        <div style={{ 
                            padding: 0,
                            margin: 0,
                            width: 200, 
                            bottom: 0, 
                            height: rowHeight || 0,
                            textTransform: "uppercase",
                            fontSize: fontSize || '',
                        }}>
                            ← Go Back
                        </div>
                    </Link>
                </div>
            </div>
        
        </div>
    )
}

export default ProjectInfo