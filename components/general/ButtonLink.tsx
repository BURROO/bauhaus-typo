import Link from 'next/link';
import styles from './Button.module.css'

interface Props{
    text: string;
    href: string;
}

const ButtonLink = ({ text, href }: Props) => {


    return (
        <Link href={href}>
            <div 
            className={styles.button}
            style={{ display: "inline-block"}}
            >
                {text}
            </div>
        </Link>
    )
}

export default ButtonLink