import { TypeProject } from "@/types/project-type";

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