import { ContextMenu } from "@/components/context/ContextMenu"
import { useContext } from "react"


interface Props{
    gradientId: string;
}

const DefFiltersSVG = ({ gradientId }: Props) => {

    const {
        screenHeight,
        screenWidth,
        rowHeight,
    } = useContext(ContextMenu)


    if(!screenWidth || !screenHeight || !rowHeight) return <></>

    return (
        <>
            <linearGradient
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    x1="0" 
                    y1="0"
                    x2={screenWidth*3} 
                    y2="0"
                    gradientTransform={`rotate(25 ${screenWidth / 2} ${screenHeight / 2})`}
                    >
                        <stop offset="0%" stopColor="rgb(190,190,190)"/>
                        <stop offset="45%" stopColor="rgb(150, 150, 150)"/>
                        <stop offset="50%" stopColor="rgb(180,180,180)"/>
                        <stop offset="100%" stopColor="rgb(190,190,190)"/>

                        <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        additive="sum"
                        from={`-${screenWidth} 0`}
                        to={`${screenWidth} 0`}
                        dur="6s"
                        repeatCount="indefinite"
                        />
            </linearGradient>
                <filter id="blurMe">
                <feGaussianBlur stdDeviation="5" />
            </filter>
                <filter id="screenPrintEffect">
                    {/* <!-- Generate noise pattern --> */}
                    <feTurbulence type="turbulence" baseFrequency="0.95" numOctaves="3" result="turbulence"/>
                
                    {/* <!-- Convert to grayscale and boost contrast --> */}
                    <feColorMatrix
                    in="turbulence"
                    type="matrix"
                    values="0.33 0.33 0.33 0 0
                0.33 0.33 0.33 0 0
                0.33 0.33 0.33 0 0
                0 0 0 0.8 0"
                result="grayscale"/>
                
                    {/* <!-- Apply threshold to create sharp black/white dots --> */}
                    <feComponentTransfer in="grayscale" result="thresholded">
                    <feFuncA type="discrete" tableValues="0 1"/>
                    </feComponentTransfer>
                
                    {/* <!-- Use the pattern as a mask or displacement map --> */}
                    <feComposite in="SourceGraphic" in2="thresholded" operator="in" result="screenPrinted"/>
                </filter>
            <filter id="metalFoil">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.02"
                    numOctaves="2"
                    seed="2"
                    result="noise"
                />

                <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="8"
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="distorted"
                />
                <feColorMatrix
                    in="distorted"
                    type="matrix"
                    values="
                    1.4 0   0   0 0
                    0   1.4 0   0 0
                    0   0   1.4 0 0
                    0   0   0   1 0"
                />
            </filter>
            <filter id="paperInkGrain" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.9"
                    numOctaves="1"
                    seed="7"
                    result="paper"
                />
                <feColorMatrix
                    in="inkNoise"
                    type="matrix"
                    values="
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0    0    0    1.3 0"
                    result="inkAlpha"
                />

                <feComponentTransfer in="inkAlpha" result="inkThreshold">
                    <feFuncA type="gamma" exponent="0.45" />
                </feComponentTransfer>

                <feComposite
                    in="SourceGraphic"
                    in2="inkThreshold"
                    operator="in"
                    result="inked"
                />

                <feComposite
                    in="inked"
                    in2="paper"
                    operator="multiply"
                />
            </filter>
        </>
    )
}

export default DefFiltersSVG