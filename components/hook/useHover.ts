import { useEffect } from "react"

export const useHover = () => {

    const setCursor = (cursor: "auto"|"pointer") => {
        document.body.style.cursor = cursor
    }

    useEffect(() => {
        return () => {
            setCursor("auto")
        }
    })
    
    return { 
        setCursor
    }
}