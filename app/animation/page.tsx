import { TypeProject } from '@/types/project-type';
import Animation from '../../components/animation/Animation'

import fs from "fs";
import path from "path";
import Papa from "papaparse";

const AnimationPage = () => {

  const filePathStudents = path.join(process.cwd(), "public/bauhaus-typo-studis.csv");

  const filePathCourses = path.join(process.cwd(), "public/bauhaus-typo-courses.csv");

  const csvStudent = fs.readFileSync(filePathStudents, "utf8");
  const csvCourses = fs.readFileSync(filePathCourses, "utf8");

  const { data: dataStudents }: { data: TypeProject[] } = Papa.parse(csvStudent, { header: true });
//   const { data: dataCourses }: { data: TypeProject[] } = Papa.parse(csvCourses, { header: true });


        
    // // .sort((a, b) => b["NAME"]?.localeCompare(a["NAME"]) )
    // .filter((item: any) => {

    //     if(typeof item["NAME"] === "undefined") return false

    //     return true
    // })

  


    return (
        <Animation data={dataStudents}/>
    )
}

export default AnimationPage