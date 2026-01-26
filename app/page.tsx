import styles from "./page.module.css";
import List from "@/components/landing/List";

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { courseShort, TypeProject } from "@/types/project-type";


export default function Home() {


  const filePathStudents = path.join(process.cwd(), "public/bauhaus-typo-studis.csv");

  const filePathCourses = path.join(process.cwd(), "public/bauhaus-typo-courses.csv");

  const csvStudent = fs.readFileSync(filePathStudents, "utf8");
  const csvCourses = fs.readFileSync(filePathCourses, "utf8");

  const { data: dataStudents }: { data: TypeProject[] } = Papa.parse(csvStudent, { header: true });
  const { data: dataCourses }: { data: TypeProject[] } = Papa.parse(csvCourses, { header: true });


        
  const sortedData = dataStudents
  // .sort((a, b) => b["Studierende"]?.localeCompare(a["Studierende"]) )
  .filter((item: any) => {

      if(typeof item["Studierende"] === "undefined") return false

      return true
  })
  .map((d, i) => ({ 
    ...d, 
    index: i,
    Id: getID(d,  i.toString().padStart(2, "0"))
  }))
  


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <List dataStudents={sortedData} dataCourses={dataCourses}/>
      </main>
    </div>
  );
}


const getID = (item: TypeProject, nr: string) => {


    const pt1 = courseShort[item['Kurs']]
    
    const nameSplit = item["Studierende"].split(' ').map(char => char.charAt(0))

    const pt2 = `${nameSplit[0]}${nameSplit[nameSplit.length-1]}`


    return `${pt1}/${pt2}/${nr}`

}

