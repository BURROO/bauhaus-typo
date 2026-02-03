import { txtLeftOfst } from "@/components/landing/svg/ListSVG";
import { TypeCoursesNames, TypeProject, TypeProjectForSVG } from "@/types/project-type";


// grid-template-columns: 2fr 2fr 1fr 1fr  2fr 2fr 1fr;

// @media screen and (max-width: 1300){
// grid-template-columns: 2fr 2fr 1fr 1fr 69px;

// @media screen and (max-width: 1000){
// grid-template-columns: 2fr 2fr 100px 69px;
const columns: { 
    [key: string]: { 
        col: number; 
        text: 'NAME'|'TITLE'|'MEDIUM'|'FORMAT'|'Kurs'|'SUPERVISION'|'ID'|'COURSE'
        fill: boolean }[]
    } = {
    'large': [
        {
            col: 2/11,
            text: 'NAME',
            fill: false,
        },{
            col: 2/11,
            text: 'TITLE',
            fill: false,
        }, {
            col: 1/11,
            text: 'MEDIUM',
            fill: false,
        }, {
            col: 1/11,
            text: 'FORMAT',
            fill: false,
        }, {
            col: 2/11,
            text: 'COURSE',
            fill: false,
        }, {
            col: 2/11,
            text: 'SUPERVISION',
            fill: true,
        }, {
            col: 1/11,
            text: 'ID',
            fill: false,
        }
    ],

    'medium': [
        {
            col: 2/7,
            text: 'NAME',
            fill: false,
        },{
            col: 2/7,
            text: 'TITLE',
            fill: false,
        }, 
        // {
        //     col: 1/7,
        //     text: 'Type',
        //     fill: false,
        // }, 
        {
            col: 2/7,
            text: 'COURSE',
            fill: false,
        }, 
         {
            col: 1/7,
            text: 'ID',
            fill: false,
        }
    ],
    'small': [
        {
            col: 1/2,
            text: 'NAME',
            fill: false,
        },{
            col: 1/2,
            text: 'TITLE',
            fill: false,
        }, 
        
    ]
}


interface Props{
    data: TypeProject[];
    screenWidth: number|null;
    screenHeight: number|null;
    rowHeight: number|null;
    activeIndex: null|number;
}



export const convertTableToSVG = ({ data, screenWidth, screenHeight, rowHeight, activeIndex }: Props): TypeProjectForSVG[][] => {

    if(screenWidth === null || screenHeight === null || rowHeight === null) return []

    const textToRender: TypeProjectForSVG[][]= []

    const screenType = screenWidth > 1300 ? 'large' : screenWidth < 800 ? 'small' : 'medium'

    let colsActive = columns[screenType].map(() => false)

    const padding = 0
    // const padding = 12
    const rowWidth = screenWidth-padding*2

    data.forEach((item: TypeProject, i, all) => {
        
        // const currentItemIndex = item.index
        const prevItem = all[i-1]
        // 

        const cols = columns[screenType]

        const y = i * rowHeight


        const rowTextToRender: TypeProjectForSVG[] = []


        for(let k = 0; k < cols.length; k++){


            const col = cols[k]
            // const colPrev = cols
            const x = cols.slice(0, k).reduce((a, b) => a + b.col, 0) * rowWidth


            const width = cols[k].col * (rowWidth)



            const defRows: { [key: string]: number } = {
                "0": 2,
                "1": 4,
                "2": 2
            }

            const rowCount = defRows[i.toString()] || 1
            const height = rowHeight * rowCount

            // @ts-ignore
            const currColRowText = item[col.text]
            // @ts-ignore
            const PrevColRowText =  prevItem && prevItem[col.text]

            // Is prev same?
            const isPrevSame = currColRowText === PrevColRowText && k !== 3

            if(!isPrevSame) colsActive[k] = !colsActive[k]

            // TODO: only render Col, if cray is active!!
            const colSquare = `M ${x} ${y} L ${x+width} ${y} L ${x+width} ${y+rowHeight} L ${x} ${y+rowHeight} `


            // if(colsActive[k]){
            //     svgPath += colSquare
            // }
            // @ts-ignore
            const activeDataRow = activeIndex !== null && data[activeIndex] && data[activeIndex][col.text]

            // const distToActiveRow = activeIndex && activeDataRow ? activeIndex - i : -1
            // console.log("distToActiveRow", distToActiveRow)

            // Check ech prev or if is also has an actvice el!!
            const currentIndex = i
            const check =
                activeIndex !== null &&
                (() => {
                    const from = Math.min(activeIndex, currentIndex);
                    const to   = Math.max(activeIndex, currentIndex);

                    const slice = data.slice(from, to + 1);
                    if (slice.length === 0) return false;

                    // @ts-ignore
                    const reference = slice[0]?.[col.text];

                    // @ts-ignore
                    return slice.every(row => row?.[col.text] === reference);
                })();


            const setActiveRow = 
                // is same as other
                activeDataRow === currColRowText &&
                check &&
                k !== 0 && 
                k !== 1 && 
                k !== 3
            // const setActiveRow = activeDataRow === currColRowText && k !== 0 && k !== 1 && k !== 3



            rowTextToRender.push({
                // text: Object.values(item)[k],
                // @ts-ignore
                // text: isPrevSame ? "" : item[col.text],
                text: item[col.text],
                hideText: isPrevSame ? true : false,
                // text: item[col.text],
                x: x + txtLeftOfst + padding,
                y: y,
                width: width,
                height: height,
                path: colSquare,
                // isPrevSame: 
                // fill: i === 0 ? false : colsActive[k],
                fill: colsActive[k],
                index: item.index,
                isActive: activeIndex === i || setActiveRow || false,
                data: item
            }) 
        }


        textToRender.push(rowTextToRender) 
    })

    return textToRender
}

export const adjustYtoOrder = (orderedList: TypeProjectForSVG[][]) => {



    return  orderedList.map((row: TypeProjectForSVG[], i, all) => {

        const accHeight = all.slice(0, i).reduce((acc, item) => acc+ item[0].height, 0)


        return row.map(col => {

            // const y = i * col.height

            const y = accHeight

            
            return ({
                ...col,
                y: y,
                fill: col.fill,
            })
        })
    })
}


export const convertAreaToSVG = ({ textToRender }: { textToRender: TypeProjectForSVG[][] }): {svgPath: string; svgActivePath: string} => {

    let svgPath = ``;
    let svgActivePath =``

    const activeCol = textToRender.find(row => row[0].isActive)
    // const activeIndex = textToRender.findIndex(row => row[0].isActive)
    // const activeCol = textToRender[activeIndex]


    textToRender.forEach((row: TypeProjectForSVG[], i, all) => {



        row.forEach((col, k) => {

            const x = col.x-txtLeftOfst
            const y = col.y
            const width = col.width
            const height = col.height

            const colSquare = `M ${x} ${y} L ${x+width} ${y} L ${x+width} ${y+height} L ${x} ${y+height} `


            if(col.isActive ){
                svgActivePath += colSquare
            }else{
                if(col.fill){
                    svgPath += colSquare
                }
            }

        })
    })


    return { svgPath, svgActivePath }
}