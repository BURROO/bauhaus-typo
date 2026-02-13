import { ContextMenu } from "@/components/context/ContextMenu"
import { useContext } from "react"
import DefFiltersSVG from "./DefFiltersSVG"

const BackgroundSVG = () => {


    const { screenWidth, screenHeight } = useContext(ContextMenu)

    if(screenWidth === null || screenHeight == null) return <></>

    const gradientId ="whatever123"

    return (
        <svg 
        viewBox={`0 0 ${screenWidth} ${screenHeight}`}
        width={screenWidth}
        height={screenHeight}
        >
            <defs>
                <DefFiltersSVG
                gradientId={gradientId}
                />
            </defs>

            <rect x={0} y={0} width={screenWidth} height={screenWidth} fill={`url(#${gradientId})`} />
            {/* <rect x={0} y={0} width={screenWidth} height={screenWidth} fill={`red`} /> */}
        </svg>
    )
}

export default BackgroundSVG