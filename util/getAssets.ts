import { courseShort, TypeProject } from "@/types/project-type"
import { sanitizeForUrl } from "./sanitizeForUrl"
import { fileDataIO } from "@/data/fileData"
import assets from '@/public/assets.json'
import websites from '@/public/websites.json'

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

    return assetFound ? src : null

}

export const getAssetWebsite = ({ item }: Props) => {

    const name = sanitizeForUrl(item.NAME)?.split("-").join("_")
    const subFulter = courseShort[item.COURSE]?.toLocaleLowerCase()

    const src = `/websites/${subFulter}/${name}/index.html` 

    const websiteFound = Object.values(websites).find(a => a === src)

    return websiteFound ? src : null
}



export const getAssetCover = ({ item }: Props) => {
    const courseFolder = courseShort[item.COURSE]

    if (!courseFolder) return null

    const fallback = 'mona_kerntke'
    const name = item.NAME
      ? sanitizeForUrl(item.NAME).replaceAll('-', '_')
      : fallback

    // @ts-ignore
    // const studentName = fileDataIO[name] ? name : fallback
    const format = 'webp'

    const front = `/images/${courseFolder.toLowerCase()}/${name}/${name}_front.${format}`;
    const back = `/images/${courseFolder.toLowerCase()}/${name}/${name}_back.${format}`;
    const spine = `/images/${courseFolder.toLowerCase()}/${name}/${name}_spine.${format}`;


    const hasFront = assets.find(a => a === front)
    const hasBack = assets.find(a => a === back)
    const hasSpine = assets.find(a => a === spine)

    if (!hasFront || !hasBack || !hasSpine) return null

    return { 
        front, 
        back, 
        spine 
    }
}


export const getAssetsPoster = ({ item }: Props) => {

    // Handle stuff…
}