import styles from './TypeLarge.module.css'

interface Props {
    text: string;
}


const TypeLarge = ({ text }: Props) => {


    return (
        <div className={styles.typeLarge}>
            <h1>Typography & Type Design</h1>
            <h2>Exhibition</h2>
            <h2>06.–0.8.02.2026</h2>
            {/* <h2>Typography & Type Design</h2> */}
            {/* Handle Type large */}
        </div>
    )
}

export default TypeLarge