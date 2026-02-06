import { TypeProject } from '@/types/project-type'
import styles from './ProjectInfo.module.css'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { ContextMenu } from '../context/ContextMenu'
import ListSVGOneRow from '../landing/svg/ListSVGOneRow'
import ButtonLink from '../general/ButtonLink'
import { getTitleAsArray, handleNameSplitting } from '@/util/handleNameSplitting'

interface Props{
    project: TypeProject
}

const ProjectInfo = ({ project }:Props) => {

    const { fontSize: size } = useContext(ContextMenu)

    const fontSize = size || 0

    const [isOpen, setIsOpen] = useState(false)

    const { rowHeight } = useContext(ContextMenu)

    // const nameLength = project.NAME.split(', ')?.length || 1

    // const customLength = project.NAME.match(/james Bru|Ossian/ig) ? 2 : null
    // const titleSplit = customLength || project.TITLE.split(': ')?.length || 1
    // const length = Math.max(nameLength, titleSplit)

    // const height = length * (rowHeight || 0)


    const { height } = handleNameSplitting({ project, rowHeight })


    const titleArray = getTitleAsArray(project.TITLE)

    return (
        <div className={styles.projectInfo} >
            <div 
            className={styles.projectInfoInner} 

            onClick={() => setIsOpen(!isOpen)}
            style={{
                paddingBottom: height,
            }}
            >
                <div
                className={styles.header} 
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                style={{ 
                    height
                    // height: isOpen ? "30vh" : rowHeight || 0
                }}>
                    <ul style={{ display: "grid", fontSize }}>
                        <li style={{ fontSize }} dangerouslySetInnerHTML={{__html: project.NAME.split(', ').join("<br/>")}}/>
                        <li style={{ fontSize }}>
                            {titleArray.map((frag, i) => <div key={i}>{frag}</div>)}
                            {/* {project.TITLE} */}
                        </li>
                        <li style={{ fontSize }}>{project.MEDIUM}</li>
                        <li style={{ fontSize }}>{project.FORMAT}</li>
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
                            <p style={{
                                fontSize: fontSize || '',
                        
                            }}>{project["DEUTSCH"]}</p>
                            <br/>
                            <p style={{
                                fontSize: fontSize || '',
                            }}>{project["ENGLISH"]}</p>
                        </div>
                    </div>


                </div>
                <ButtonLink href="/" text='Go Back' />
            </div>
        
        </div>
    )
}

export default ProjectInfo