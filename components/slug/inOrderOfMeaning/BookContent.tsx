import { TypeProject } from '@/types/project-type'
import styles from './BookContent.module.css'


const slides = [
    `/images/ioom/front.jpg`,
    `/images/ioom/back.jpg`,
    `/images/ioom/front.jpg`,
    `/images/ioom/back.jpg`,
]


interface Props{
    item: TypeProject;
    onClick: () => void;
}


const BookContent = ({ item, onClick }: Props) => {

    // Use a slideshow here!!

    return (
        <div className={styles.bookContent}>
            {/*  */}
            <div onClick={onClick}>Cover</div>
            <div className={styles.slideshow}>
                <div className={styles.wrapper}>
                    {
                        slides.map((slide, i) => {


                            return (
                                <div key={i} className={styles.slide}>

                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}


export default BookContent