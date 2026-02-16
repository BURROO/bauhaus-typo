import styles from "./page.module.css";
import List from "@/components/landing/List";

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import {  TypeProject } from "@/types/project-type";
import { Suspense } from "react";


export default function Home() {


  const filePathStudents = path.join(process.cwd(), "public/bauhaus-typo-studis.csv");

  const filePathCourses = path.join(process.cwd(), "public/bauhaus-typo-courses.csv");

  const csvStudent = fs.readFileSync(filePathStudents, "utf8");
  const csvCourses = fs.readFileSync(filePathCourses, "utf8");

  const { data: dataStudents }: { data: TypeProject[] } = Papa.parse(csvStudent, { header: true });
  const { data: dataCourses }: { data: TypeProject[] } = Papa.parse(csvCourses, { header: true });


        
  const sortedData = dataStudents
  // .sort((a, b) => b["NAME"]?.localeCompare(a["NAME"]) )
  .filter((item: any) => {

      if(typeof item["NAME"] === "undefined") return false

      return true
  })
  .map((d, i) => ({ 
    ...d, 
    index: i,
  }))
  


  return (
    <Suspense fallback={null}>
      <div className={styles.page}>
        <main className={styles.main}>
          <List dataStudents={sortedData} dataCourses={dataCourses}/>
        </main>
      </div>
    </Suspense>
  );
}
