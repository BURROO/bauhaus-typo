import { cloneDeep, fill } from "lodash"
import TextSVG from "./TextSVG"

interface Props{
    row: any[], 
    filters?: ['isActive'];
    fillSwitch?: { condition: 'fill', case1: string; case2: string}
}

const ListRowSVG = ({ row, filters, fillSwitch }: Props) => {

    let rowRendered = cloneDeep(row)

    if(filters !== undefined) filters.forEach(filter => rowRendered = rowRendered.filter(a => a[filter] === true))

    return (
         <g >
            {
                rowRendered.map((d, k) => (
                    <TextSVG
                    key={k}
                    position={d}
                    text={!d.hideText && d.text}
                    fill={fillSwitch && (d[fillSwitch.condition] ? fillSwitch.case1 : fillSwitch?.case2) || ''}
                    // text={!d.hideText && (!d.fill || d.isActive) && d.text}
                    />
                ))
            }
        </g>
    )
}

export default ListRowSVG