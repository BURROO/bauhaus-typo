import { courseShort, TypeProject } from "@/types/project-type";

export const sanitizeForUrl = (text: string) => {


    if(typeof text === "undefined") return "undefined"

    return text
        .toLowerCase()
        .normalize("NFD")                  // split accents from letters
        .replace(/[\u0300-\u036f]/g, "")   // remove accents
        .replace(/[^a-z0-9\s-]/g, "")      // remove special chars
        .trim()
        .replace(/\s+/g, "-")              // spaces → dashes
        .replace(/-+/g, "-");              // collapse dashes
    // Handle url sanitizing
}


export const getUrlFromProject = (item: TypeProject) => {

    const kurs = sanitizeForUrl(item?.COURSE)
    const studierende = sanitizeForUrl(item?.NAME)

    // 


    return `/${kurs}/${studierende}`
}


export const getType = (item: TypeProject): "WEBSITE"|"PUBLICATION"|"POSTER"|"SLIDESHOW" => {


    const isOnScreen =  (item["MEDIUM"].toUpperCase() === "WEBSITE" || item["MEDIUM"].toUpperCase() === "WEBTOOL")

    if(isOnScreen) return "WEBSITE"
    // const isPublication = (item["MEDIUM"].toUpperCase() === "PUBLICATION" || item["MEDIUM"].toUpperCase() === "ZINE")
    const isPublication = (
        item["MEDIUM"].toUpperCase() === "PUBLICATION" 
        // ||
        // item["MEDIUM"].toUpperCase() === "CARD GAME" 
    )

    if(isPublication) return "PUBLICATION"

    const isPoster = (
        item["MEDIUM"].toUpperCase() === "POSTER" ||
        item["MEDIUM"].toUpperCase() === "ZINE" ||
        item["MEDIUM"].toUpperCase() === "EXHIBITION" 
    )

    if(isPoster) return "POSTER"


    return "SLIDESHOW"

    // const isSlideshow = !isOnScreen && !isPublication && !isPoster


    // return {
    //     isOnScreen,
    //     isPublication,
    //     isPoster,
    //     isSlideshow
    // }
}