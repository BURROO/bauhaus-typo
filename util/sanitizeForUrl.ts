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


    // 
}




export const getUrlVideo = (item: TypeProject) => {


    const kursShort = courseShort[item.COURSE].toLowerCase()
    const student = sanitizeForUrl(item.NAME).split("-").join("_")


    // @ts-ignore
    const src = `/images/${kursShort}/showcase/${student}_showcase.webm`


  // console.log("filename", filename, fileDataTT[filename]?.showcase)
    return src
  // @ts-ignore
}



export const getType = (item: TypeProject): { isOnScreen: boolean; isPublication: boolean; isSlideshow: boolean } => {


    const isOnScreen =  item["MEDIUM"] === "Website" || item["MEDIUM"] === "Webtool"
    const isPublication = item["MEDIUM"] === "Publication" || item["MEDIUM"] === "Zine"
    const isSlideshow = !isOnScreen && !isPublication


    return {
        isOnScreen,
        isPublication,
        isSlideshow
    }
}