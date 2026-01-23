export type TypeCourses = 
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
  [K in TypeCourses]: string
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

export interface TypeProject {
    Kurs: TypeCourses;
    Supervision: string;
    Studierende: string;
    Title: string;
    Image: string;
    Link: string;
    Type: 'WWW' | 'BOOK' | 'PRINT'
    // in order of meaning!
    book?: {
        front: string;
        back: string;
        spine: string;
    };
    "Text DE": string;
    "Text EN": string;
    // Automated:
    Format: string;
    index: number;
}