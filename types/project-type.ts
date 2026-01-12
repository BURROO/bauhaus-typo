export interface TypeProject {
    Kurs: 'Transcoding Typography' | 'In Order Of Meaning ' | 'Punk Zine';
    Studierende: string;
    Title: string;
    Image: string;
    Link: string;
    // in order of meaning!
    book?: {
        front: string;
        back: string;
        spine: string;
    }
}