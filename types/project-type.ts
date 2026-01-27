export type TypeCoursesNames = 
'Transcoding Typography' | 
'In Order Of Meaning' | 
'Handmade Websites as Punk Zines' | 
'Bauhaus Master Lectures' |
'First Year Introduction' |
// 'Introduction Typography' |
'Independent Project' |
'204 Type-Gazette Issue 06' |
'Bauhaus Inhouse'


type TypeCourseShort = {
  [K in TypeCoursesNames]: string
}

export const courseShort: TypeCourseShort = {
    'Transcoding Typography': 'TT',
    'In Order Of Meaning': 'OM',
    'Bauhaus Master Lectures': 'BM',
    'Bauhaus Inhouse': 'BI',
    'Handmade Websites as Punk Zines': 'PZ',
    // 'Introduction Typography': 'IT',
    'First Year Introduction': 'IT',
    'Independent Project': 'IP',
    '204 Type-Gazette Issue 06': 'TG'
}


// NR;DATE;NAME;TITLE;MEDIUM;FORMAT;COURSE;SUPERVISION;ID;DEUTSCH;ENGLISH
export interface TypeProject {
    COURSE: TypeCoursesNames;
    SUPERVISION: string;
    NAME: string;
    TITLE: string;
    Image: string;
    Link: string;
    MEDIUM: 'Website' | 'Webtool' | 'Publication' | 'Poster' | 'Exhibition' | 'Zine' | 'Card Game';
    // in order of meaning!
    book?: {
        front: string;
        back: string;
        spine: string;
    };
    DEUTSCH: string;
    ENGLISH: string;
    // Automated:
    FORMAT: string;
    index: number;
    ID: string;
}
// export interface TypeProject {
//     Kurs: TypeCoursesNames;
//     Supervision: string;
//     Studierende: string;
//     Title: string;
//     Image: string;
//     Link: string;
//     Type: 'WWW' | 'BOOK' | 'PRINT'
//     // in order of meaning!
//     book?: {
//         front: string;
//         back: string;
//         spine: string;
//     };
//     "DEUTSCH": string;
//     "ENGLISH": string;
//     // Automated:
//     Format: string;
//     index: number;
//     id: string;
// }



export interface TypeProjectForSVG {
    text: string;
    hideText: boolean;
    // text: item[col.text],
    x: number,
    y: number,
    width: number;
    height: number;
    path: string,
    // isPrevSame: 
    fill: boolean;
    index: number;
    isActive: boolean;
    data: TypeProject;
}

export interface TypeCourse {
    COURSE: string;
    SUPERVISION: string;
    DEUTSCH: string;
    ENGLISH: string;

}