import styles from "./page.module.css";
import List from "@/components/landing/List";

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { TypeProject } from "@/types/project-type";


export default function Home() {


  const filePath = path.join(process.cwd(), "public/bauhaus-typo-studis.csv");

  const csv = fs.readFileSync(filePath, "utf8");

  const { data }: { data: TypeProject[] } = Papa.parse(csv, { header: true });

  const listData = data
  // @ts-ignore
    .filter(data => data.Kurs !== "")
    .sort((a, b) => a.Studierende.localeCompare(b.Studierende))
    .sort((a, b) => a.Kurs.localeCompare(b.Kurs))
    .map(data => {

      // Temporary info!!!
      return ({
        ...data,
        Format: `${Math.floor(Math.random()*100)}×${Math.floor(Math.random()*100)}`
      })
    })
        
  const sortedData = data
  // .sort((a, b) => b["Studierende"]?.localeCompare(a["Studierende"]) )
  .filter((item: any) => {

      if(typeof item["Studierende"] === "undefined") return false

      return true
  })
  .map((d, i) => ({ ...d, index: i }))


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <List data={sortedData} />
      </main>
    </div>
  );
}
