// // import fs from 'fs'
// // import path from 'path'
// // import pdf from 'pdf-poppler'

// // export async function pdfToSlides(pdfPath: string, outDir: string) {
// //   const opts = {
// //     format: 'jpeg',
// //     out_dir: outDir,
// //     out_prefix: 'page',
// //     page: null,
// //   }

// //   await pdf.convert(pdfPath, opts)

// //   const files = fs.readdirSync(outDir)
// //     .filter(f => f.startsWith('page'))
// //     .sort()

// //   return files.map(f => `/generated/${f}`)
// // }


// import { getDocument } from 'pdfjs-dist'

// export async function pdfToSlides(pdfUrl: string) {
//   const pdf = await getDocument(pdfUrl).promise
//   const slides: string[] = []

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i)
//     const viewport = page.getViewport({ scale: 2 })

//     const canvas = document.createElement('canvas')
//     const ctx = canvas.getContext('2d')!

//     canvas.width = viewport.width
//     canvas.height = viewport.height

//     await page.render({ canvasContext: ctx, viewport }).promise

//     slides.push(canvas.toDataURL('image/jpeg'))
//   }

//   return slides
// }

export {}