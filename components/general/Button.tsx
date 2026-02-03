import { useContext } from 'react';
import styles from './Button.module.css'
import { ContextMenu } from '../context/ContextMenu';

interface Props{
    onClick: () => void;
    text: string;
}

const Button = ({ onClick, text }: Props) => {


    const { fontSize } = useContext(ContextMenu)

    return (
        <button 
        className={styles.button}
        style={{ fontSize: fontSize || "" }}
        onClick={onClick}>
            {text}
        </button>
    )
}

export default Button