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
    .sort((a, b) => a.Studierende.localeCompare(b.Studierende))
    .sort((a, b) => a.Kurs.localeCompare(b.Kurs))
    .map(data => {

      // Temporary info!!!
      return ({
        ...data,
        Format: `${Math.floor(Math.random()*100)}×${Math.floor(Math.random()*100)}`
      })
    })

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <List data={listData} />
      </main>
    </div>
  );
}
