
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { TypeProject } from "@/types/project-type";
import PageWrapper from "@/components/slug/PageWrapper";
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

    const rowKurs = row.Kurs?.toLowerCase().split(" ").join("-")
    const rowStudierende = row.Studierende?.toLowerCase().split(" ").join("-")
    
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

  return data
    .filter(row => row.Kurs && row.Studierende)
    .map(row => ({
      kurs: row.Kurs!.toLowerCase().split(" ").join("-"),
      slug: row.Studierende!.toLowerCase().split(" ").join("-"),
    }));
}



// export const getStaticPaths = async (ctx) => {

//   console.log(ctx)

//   const filePath = path.join(process.cwd(), "public/bauhaus-typo-studis.csv");

//   const csv = fs.readFileSync(filePath, "utf8");

//   const { data } = Papa.parse(csv, { header: true });

//   const item =  data.find(row => row.Kurs === 'test')



//   return {
//     paths: [
//       {
//         params: {
//           course: 'next.js',
//         },
//       }, // See the "paths" section below
//     ],
//     fallback: true, // false or "blocking"
//   }

// }


// export const getStaticProps = async (context) => {
//   const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   const repo = await res.json()
//   return { props: { repo } }
// }