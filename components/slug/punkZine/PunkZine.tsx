import { TypeProject } from "@/types/project-type"
import styles from './PunkZine.module.css'

interface Props {
    item: TypeProject
}

const PunkZine = ({ item }: Props) => {


    return (
        <div className={styles.punkZine}>
            <iframe src={item.Link}></iframe>
            <h1>{item.Studierende}</h1>
            Punk Zine
        </div>
    )
}

export default PunkZine