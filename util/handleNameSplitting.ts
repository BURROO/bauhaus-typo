import { TypeProject } from "@/types/project-type"

interface Input {
    project: TypeProject;
    rowHeight: number| null;
}



export const getNameAsArray = (name : string) => {

    return  name.split(',')

}

export const getTitleAsArray = (title : string) => {

    // if()
    if(title.toLowerCase().match('a visual diss')){
        return ['A visual Dissection of', 'the Ok-Sign']
    }else if(title.toLowerCase().match('typo bal')){
        return ['Typo Balla(nce):', 'Charming Ligature']
    }else if(title.toLowerCase().match('durch foto')){
        return ['Durch Fotografie', 'keine Einsichten']
    }else{
        return [title]
    }

}


export const getLinesPerRow = ({ project }: { project: TypeProject }) => {
    
    const nameLength = project.NAME.split(', ')?.length || 1

    const customLength = project.NAME.match(/james Bru|Ossian/ig) ? 2 : null
    const titleSplit = customLength || project.TITLE.split(': ')?.length || 1
    const length = Math.max(nameLength, titleSplit)
    // const height = length * (rowHeight || 0)


    return length
}


export const getTotalLinesForListOfPojects = ({ projects }: { projects: TypeProject[] }) => {

    const accP = projects.reduce((acc, project) => acc + getLinesPerRow({ project }), 0)

    return accP
}

export const handleNameSplitting = ({ project, rowHeight }: Input) => {

    // Logic for splitting name!!
    // const nameLength = project.NAME.split(', ')?.length || 1

    // const customLength = project.NAME.match(/james Bru|Ossian/ig) ? 2 : null
    // const titleSplit = customLength || project.TITLE.split(': ')?.length || 1
    // const length = Math.max(nameLength, titleSplit)

    const length = getLinesPerRow({ project })
    const height = length * (rowHeight || 0)

    return {
        height
    }
}


// export const lineCount = () => {
//     const count = studentsFromCourse.reduce((acc, data) => {
        
//         const titleLength = data.TITLE.split(':').length
//         const nameLength = data.NAME.split(',').length

//         console.log(data.TITLE, "titleLength ", titleLength)
        
//         const length = Math.max(titleLength, nameLength)
        
//         return acc + length
//     }, 0)

//     return count
// }