import { useEffect, useState } from "react";

export const useMousePos = ({}, condition: boolean) => {

     const [mousePos, setMousePos ] = useState<null|{x: number; y: number }>(null)
     const [relPos, setRelPos ] = useState<null|{x: number; y: number }>(null)
    

    useEffect(() => {

        const handleMousePos = (e: any) => {

            const { clientX: x, clientY: y} = e


            const relPos = {
                x: x / window.innerWidth,
                y: y / window.innerHeight
            }
            
            setMousePos({ x, y })
            setRelPos(relPos)
        }

        if(condition){
            window.addEventListener("mousemove", handleMousePos)
        }else{
            setMousePos(null)
            setRelPos(null)
            window.removeEventListener("mousemove", handleMousePos)
        }

            return () => {
    
                setMousePos(null)
                setRelPos(null)
                window.removeEventListener("mousemove", handleMousePos)
            }
    
    }, [condition])

    return { mousePos, relPos }
}