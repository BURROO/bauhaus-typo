
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { TypeProject } from "@/types/project-type";
import PageWrapper from "@/components/slug/PageWrapper";
import { sanitizeForUrl } from "@/util/sanitizeForUrl";
// import dynamicImport from "next/dynamic";

// const PageWrapper = dynamicImport(
//   () => import("@/components/slug/PageWrapper"),
//   { ssr: false }
// );

export default async function Project({ params }: any) {

  const { kurs, slug } = await params

  const filePath = path.join(process.cwd(), "public/bauhaus-typo-studis.csv");

  const csv = fs.readFileSync(filePath, "utf8");

  const { data } = Papa.parse(csv, { header: true }) satisfies { data: TypeProject[] };

  const item: TypeProject|undefined =  data.find(row => {

    const rowKurs = sanitizeForUrl(row.COURSE)
    const rowStudierende = sanitizeForUrl(row.NAME)
    
    return rowKurs === kurs && rowStudierende === slug
  })

  if(typeof item === "undefined") return <>Not found</>


  return (
    <PageWrapper item={item} />
  );
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public/bauhaus-typo-studis.csv");
  const csv = fs.readFileSync(filePath, "utf8");

  const { data } = Papa.parse(csv, { header: true }) as {
    data: TypeProject[];
  };

  // console.log(data)

  return data
    .filter(row => row.COURSE && row.NAME)
    .map(row => ({
      kurs: sanitizeForUrl(row.COURSE),
      slug: sanitizeForUrl(row.NAME),
    }));
}


// export const getStaticProps = async (context) => {
//   const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   const repo = await res.json()
//   return { props: { repo } }
// }