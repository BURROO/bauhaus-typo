import { useEffect, useState } from 'react';
import styles from './Background.module.css'

interface Props{
    text: string;
    dir: 1|-1;
}
const Background = ({ text, dir }: Props) => {


    const [isInactive, setIsInactive] = useState(true)


    useEffect(() => {


        let timeout: any;


        const handleActivity = () => {

            // Handle activity logic
            setIsInactive(false)
            // 
            clearTimeout(timeout)

            timeout = setTimeout(() => {

            setIsInactive(true)

        }, 5000)
        }

        window.addEventListener("mousemove", handleActivity)


        return () => {

            window.removeEventListener("mousemove", handleActivity)
        }

    }, [])


    if(!isInactive) return;


    return (
        <div className={styles.background}>
            <div className={styles.backgroundWrapper}
             style={{
                animationDirection: dir === 1 ? 'normal' : 'reverse',
                // transform: `translate(calc(${-ofst/30}%))`, 
                animationDuration: `${text.length * 2000}ms`
            }}
            >
               {text}{text}
            </div>
        </div>
    )
}

export default Background