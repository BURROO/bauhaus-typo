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
            // clearTimeout(timeout)

            // timeout = setTimeout(() => {

            //     setIsInactive(true)

            // }, 5000)
        }
        const mouseOut = () => {

            // Handle activity logic
            setIsInactive(true)
            // 
            clearTimeout(timeout)

        }

        window.addEventListener("mousemove", handleActivity)
        window.addEventListener("wheel", handleActivity)
        document.addEventListener("mouseleave", mouseOut)


        return () => {

            window.removeEventListener("mousemove", handleActivity)
            window.removeEventListener("wheel", handleActivity)
            document.removeEventListener("mouseleave", mouseOut)
        }

    }, [])

    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        requestAnimationFrame(() => {
            setAnimate(true)
        })
    }, [])


    // if(!isInactive) return;


    return (
        <div
        className={styles.background}
        >
            <div 
            // className={styles.backgroundWrapper}
            className={`${styles.backgroundWrapper} ${animate ? styles.animate : ""}`}
             style={{
                animationDirection: dir === 1 ? 'normal' : 'reverse',
                animationDuration: `${text.length * (isInactive ? 2000 : 4000)}ms`
            }}
            >
               {text}{text}
            </div>
        </div>
    )
}

export default Background