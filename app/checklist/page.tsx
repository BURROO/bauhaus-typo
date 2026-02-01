import styles from "./page.module.css";
import List from "@/components/landing/List";

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { courseShort, TypeProject } from "@/types/project-type";
import { getUrlFromProject } from "@/util/sanitizeForUrl";
import Link from "next/link";
import { getAssetCover, getAssetShowcase, getAssetSlideShow, getAssetWebsite } from "@/util/getAssets";


export default function Home() {

  const filePathStudents = path.join(process.cwd(), "public/bauhaus-typo-studis.csv");

  const filePathCourses = path.join(process.cwd(), "public/bauhaus-typo-courses.csv");

  const csvStudent = fs.readFileSync(filePathStudents, "utf8");
  const csvCourses = fs.readFileSync(filePathCourses, "utf8");

  const { data: dataStudents }: { data: TypeProject[] } = Papa.parse(csvStudent, { header: true });
  const { data: dataCourses }: { data: TypeProject[] } = Papa.parse(csvCourses, { header: true });




  return (
    <div className={styles.page}>
      <main className={styles.main} style={{
        display: "grid",
        gridTemplateColumns: `1fr`,
        paddingTop: 16,
      }}>
        <div style={{ position: "fixed", top: 0 }}>
            <div
            style={{ 
              display: "grid", 
              gridTemplateColumns: `1fr 1fr 1fr 1fr 1fr 1fr 1fr`,
              borderBottom: "1px solid black",
              width: "100vw",
              background: "white"
            }}>
              <div>NAME</div>
              <div>TITLE</div>
              <div>COURSE</div>
              <div>DEUTSCH</div>
              <div>ENGLISH</div>
              <div>Cover/Iframe</div>
              <div>Slides/Website</div>
            </div>

        </div>
        {dataStudents.map((project, i) => {

          const DE = project.DEUTSCH
          const EN = project.ENGLISH

          const courseFolder = courseShort[project.COURSE]?.toLocaleLowerCase()  

          const slides = getAssetSlideShow({ item:project })
          const showcase = getAssetShowcase({ item:project })
          // 
          const website = getAssetWebsite({ item: project })
          const cover = getAssetCover({ item: project })
          
          let product = ``;
          let productMarked = false
          let content = ``;
          let contentMarked = false;


          if(
            courseFolder === 'tt' || 
            courseFolder === 'pz' ||
            project.NAME === 'Nic Möckel'
          ){
            // 
            product = `Showcase: ${!!showcase}`
            productMarked = !showcase
            // 
            content = `Website: ${!!website}`
            contentMarked = !website
          }else if(
            courseFolder === 'om' ||
            project.NAME === 'Ossian Osborne'
          ){
            // 
            product = `Covers: ${!!cover}`
            productMarked = !cover

            // 
            content = `Slides: ${slides.length.toString()}`
            contentMarked = slides.length === 0

          }


          const items = [
              () => <Column key={i} label="Name" data={project.NAME} />,
              () => <Column key={i} label="Title" data={project.TITLE} />,
              () => <Column key={i} label="Course" data={project.COURSE} />,
              () => <Column key={i} label="Deutsch" data={DE?.length.toString()} isMarked={DE?.length === 0}/>,
              () => <Column key={i} label="English" data={EN?.length.toString()} isMarked={EN?.length === 0} />,
              () => <Column key={i} label="Slides" data={product} isMarked={productMarked} />,
              () => <Column key={i} label="Slides" data={content} isMarked={contentMarked} />,
          ]

          const url = getUrlFromProject(project)



          return(
            <Link
            href={url}
            key={i}
            >
              <div
              style={{ 
                display: "grid", 
                gridTemplateColumns: `1fr 1fr 1fr 1fr 1fr 1fr 1fr`,
                borderBottom: "1px solid black",
              }}>
                {
                  items.map((Item, i) => <Item key={i}/>)
                }
              </div>
            </Link>
          )
        })}
      </main>
    </div>
  );
}


const Column = ({ label, data, isMarked }: { label: string; data: string; isMarked?: boolean }) => {


  return (
    <div style={{ 
      display: "flex",
      background: isMarked ? "red" : "",
      borderRight: "1px solid black"
      // display: "grid", 
      // gridTemplateColumns: `1fr 1fr`
    }}>
      {/* <div>{label}:</div> */}
      <div>{data}</div>
    </div>
  )
}