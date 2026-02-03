import Link from 'next/link';
import styles from './Button.module.css'
import { useContext } from 'react';
import { ContextMenu } from '../context/ContextMenu';

interface Props{
    text: string;
    href: string;
}

const ButtonLink = ({ text, href }: Props) => {

    const { fontSize } = useContext(ContextMenu)

    return (
        <Link href={href}>
            <div 
            className={styles.button}
            style={{ display: "inline-block", fontSize: fontSize || "" }}
            >
                {text}
            </div>
        </Link>
    )
}

export default ButtonLink