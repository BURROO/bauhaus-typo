import styles from './ListHeader.module.css'



interface Props {
    rowHeight: number;
}

const ListHeader = ({ rowHeight }: Props) => {

    return (
        <>
            <li
            className={`${styles.row} ${styles.header}`}
            style={{ height: rowHeight}}
            >
                {/* <div>Nr</div> */}
                <div>Name</div>
                <div>Title</div>
                <div>Medium</div>
                <div>Format</div>
                <div>Course</div>
                <div>Supervision</div>
                <div>ID</div>
            </li>
            <li
            // Just to offset the list!
            className={`${styles.row}`}
            style={{ height: rowHeight}}
            >
                {/* <div>Nr</div> */}
                <div>Name</div>
                <div>Title</div>
                <div>Medium</div>
                <div>Format</div>
                <div>Course</div>
                <div>Supervision</div>
                <div>ID</div>
            </li>
        </>

    )
}

export default ListHeader