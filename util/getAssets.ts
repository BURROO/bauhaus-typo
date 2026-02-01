import { courseShort, TypeProject } from "@/types/project-type"
import { sanitizeForUrl } from "./sanitizeForUrl"
import { fileDataIO } from "@/data/fileData"
import assets from '@/public/assets.json'

interface Props {
    item: TypeProject
}

export const getAssetSlideShow = ({ item }: Props): string[] => {

    const kurs = sanitizeForUrl( item.COURSE).split("-").join("_")
    const student = sanitizeForUrl( item.NAME).split("-").join("_")
    const courseFolder = courseShort[item.COURSE]?.toLocaleLowerCase()  

    // 
    const slides = []
    // @ts-ignore
    // const count = (fileDataIO[student] || fileDataIO["mona_kerntke"]).count


    // Get the count from asset instea/images/bm/susan_arian_julide_nur_alemdar/slide-d!!
    const count = assets.filter(a => a.match(`/images/${courseFolder}/${student}/slide`)).length
    

    for(let i = 1; i <= count;i++){

        slides.push(`/images/${courseFolder}/${student}/slide-${i}.webp`)
    }

    return slides
}


export const getAssetShowcase = ({ item }: Props) => {
    // 


    const kursShort = courseShort[item.COURSE]?.toLowerCase()
    const student = sanitizeForUrl(item.NAME).split("-").join("_")

    // @ts-ignore
    const src = `/images/${kursShort}/showcase/${student}_showcase.webm`

    const assetFound = assets.find(a => a === src)


    console.log("assetFound", assetFound, src)

    return assetFound ? src : null

}


    // const student = item.NAME.toLowerCase().split(" ").join("_")
    // // const kurs = sanitizeForUrl( item.COURSE).split("-").join("_")
    // const student = sanitizeForUrl( item.NAME).split("-").join("_")

    // const slides = []
    // // @ts-ignore
    // const count = fileDataIO[student] || 0

    // const courseFolder = courseShort[item.COURSE]?.toLocaleLowerCase()
    

    // for(let i = 1; i <= count;i++){

    //     slides.push(`/images/${courseFolder}/${student}/slide-${i}.webp`)
    // }

    // return slides

