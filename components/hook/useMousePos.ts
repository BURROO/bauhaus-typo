import { useEffect, useState } from "react";

export const useMousePos = ({}, condition: boolean) => {

     const [mousePos, setMousePos ] = useState<null|{x: number; y: number }>(null)
    

    useEffect(() => {

        const handleMousePos = (e: any) => {

            const { clientX: x, clientY: y} = e
            
            setMousePos({ x, y })
        }

        if(condition){
            window.addEventListener("mousemove", handleMousePos)
        }else{
            setMousePos(null)
            window.removeEventListener("mousemove", handleMousePos)
        }

            return () => {
    
                setMousePos(null)
                window.removeEventListener("mousemove", handleMousePos)
            }
    
    }, [condition])

    return mousePos
}