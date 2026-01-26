import { txtLeftOfst, txtTopOfst } from "@/components/landing/ListSVG";
import { TypeCoursesNames, TypeProject, TypeProjectForSVG } from "@/types/project-type";


// grid-template-columns: 2fr 2fr 1fr 1fr  2fr 2fr 1fr;

// @media screen and (max-width: 1300){
// grid-template-columns: 2fr 2fr 1fr 1fr 69px;

// @media screen and (max-width: 1000){
// grid-template-columns: 2fr 2fr 100px 69px;
const columns: { 
    [key: string]: { 
        col: number; 
        text: 'Studierende'|'Title'|'Type'|'Format'|'Kurs'|'Supervision'|'Id' 
        fill: boolean }[]
    } = {
    'large': [
        {
            col: 2/11,
            text: 'Studierende',
            fill: false,
        },{
            col: 2/11,
            text: 'Title',
            fill: false,
        }, {
            col: 1/11,
            text: 'Type',
            fill: false,
        }, {
            col: 1/11,
            text: 'Format',
            fill: false,
        }, {
            col: 2/11,
            text: 'Kurs',
            fill: false,
        }, {
            col: 2/11,
            text: 'Supervision',
            fill: true,
        }, {
            col: 1/11,
            text: 'Id',
            fill: false,
        }
    ],

    'medium': [
        {
            col: 2/7,
            text: 'Studierende',
            fill: false,
        },{
            col: 2/7,
            text: 'Title',
            fill: false,
        }, 
        // {
        //     col: 1/7,
        //     text: 'Type',
        //     fill: false,
        // }, 
        {
            col: 2/7,
            text: 'Kurs',
            fill: false,
        }, 
         {
            col: 1/7,
            text: 'Id',
            fill: false,
        }
    ],
    'small': [
        {
            col: 1/2,
            text: 'Studierende',
            fill: false,
        },{
            col: 1/2,
            text: 'Title',
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


interface Return {
    textToRender: TypeProjectForSVG[][];
    svgPath: string;
}



export const convertTableToSVG = ({ data, screenWidth, screenHeight, rowHeight, activeIndex }: Props): TypeProjectForSVG[][] => {


    if(screenWidth === null || screenHeight === null || rowHeight === null) return []

    // let svgPath = ``;

    const textToRender: TypeProjectForSVG[][]= []


    const screenType = screenWidth > 1300 ? 'large' : screenWidth < 800 ? 'small' : 'medium'

    let colsActive = columns[screenType].map(() => true)


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
            const x = cols.slice(0, k).reduce((a, b) => a + b.col, 0) * screenWidth
            const width = cols[k].col * screenWidth
            const height = rowHeight
            // console.log("x", x). 

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
            const activeDataRow = activeIndex && data[activeIndex] && data[activeIndex][col.text]

            const setActive = activeDataRow === currColRowText && k !== 0 && k !== 1 && k !== 3
            // const setActive = activeDataRow === currColRowText && k !== 0 && k !== 1 && k !== 3



            rowTextToRender.push({
                // text: Object.values(item)[k],
                // @ts-ignore
                // text: isPrevSame ? "" : item[col.text],
                text: item[col.text],
                hideText: isPrevSame ? true : false,
                // text: item[col.text],
                x: x + txtLeftOfst,
                y: y + txtTopOfst,
                width: width,
                height: height,
                path: colSquare,
                // isPrevSame: 
                // fill: i === 0 ? false : colsActive[k],
                fill: colsActive[k],
                index: item.index,
                isActive: activeIndex === i || setActive,
                data: item
            }) 
        }


        textToRender.push(rowTextToRender) 
    })


    return textToRender
}

export const adjustYtoOrder = (orderedList: TypeProjectForSVG[][]) => {



    return  orderedList.map((row: TypeProjectForSVG[], i, all) => {




        return row.map(col => {

            const y = i * col.height

            
            return ({
                ...col,
                // text: isPrevSame ? "" : item[col.text],
                // x: x + 2,
                y: y + 12,
                // width: width,
                // height: height,
                // path: colSquare,
                // fill: i === 0 ? false : col.fill
                fill: col.fill,
                // fill: col.fill
            })
        })
    })
}


export const convertAreaToSVG = ({ textToRender }: { textToRender: TypeProjectForSVG[][] }): {svgPath: string; svgActivePath: string} => {


    let svgPath = ``;
    let svgActivePath =``



    const activeCol = textToRender.find(row => row[0].isActive)


    textToRender.forEach((row: TypeProjectForSVG[], i, all) => {





        row.forEach((col, k) => {

            const x = col.x-2
            const y = col.y-12
            const width = col.width
            const height = col.height

            const colSquare = `M ${x} ${y} L ${x+width} ${y} L ${x+width} ${y+height} L ${x} ${y+height} `


            const isCurrColSameAsIndex = activeCol && activeCol[k].text === col.text && k !== 0 && k !== 1 && k !== 3
            // const isCurrColSameAsIndex = activeCol && activeCol[k].text === col.text



            if(col.isActive || isCurrColSameAsIndex){
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