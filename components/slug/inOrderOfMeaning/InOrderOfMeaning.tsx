import { TypeProject } from "@/types/project-type"
import styles from './InOrderOfMeaning.module.css'
import ParametricBook from "./ParametricBook"
import { useState } from "react"
import BookContent from "./BookContent"


interface Props {
    item: TypeProject
}

const InOrderOfMeaning = ({ item }: Props) => {



    const [view, setView] = useState<'cover'|'content'>('cover')


    const index = item.Studierende.length % 2 + 1



    return (
        <>
            <div className={styles.inOrderOfMeaning}>
                {view === "cover" && <ParametricBook type="interact" item={item} onClick={() => setView('content')}/>}
                {view === "content" && <BookContent item={item} onClick={() => setView('cover')}/>}
            </div>
        
            <div className={styles.infoOverlay}>
                Lorem ipsum ist ein standardisierter Platzhaltertext, der in der Druck- und Schriftsetzungsindustrie verwendet wird, um ein visuelles Layout zu demonstrieren, ohne dass der endgültige Inhalt bereits verfügbar ist.
                Der Text dient dazu, den Eindruck eines fertigen Schriftstücks zu vermitteln, da die Verteilung der Buchstaben und Wörter der natürlichen lateinischen Sprache ähnelt und somit einen realistischen Zeilenfall erzeugt.
                Er ist bewusst unverständlich, damit der Betrachter sich nicht durch den Inhalt ablenken lässt, sondern sich auf das Gesamtdesign konzentrieren kann.

            </div>
        </>
    )
}

export default InOrderOfMeaning



