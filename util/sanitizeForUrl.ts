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


    const kursShort = courseShort[item.Kurs].toLowerCase()
    const student = sanitizeForUrl(item.Studierende).split("-").join("_")


    // @ts-ignore
    const src = `/images/${kursShort}/showcase/${student}_showcase.webm`


  // console.log("filename", filename, fileDataTT[filename]?.showcase)
    return src
  // @ts-ignore
}