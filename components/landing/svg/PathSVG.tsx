interface Props {
    svgPath: string;
    gradientId: string;
    maskId: string;
}

const PathSVG = ({ svgPath, gradientId, maskId }: Props) => {

    return (
        <>
            <path
            d={svgPath}
            fill={`url(#${gradientId})`}
            mask={`url(#${maskId})`}
            />
            {/* <path
            d={svgPath}
            filter={`url(#screenPrintEffect)`}
            fill="rgba(240,240,240,0.2)"
            /> */}
        </>
    )
}

export default PathSVG