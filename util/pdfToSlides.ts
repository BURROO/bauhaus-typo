// export async function pdfToSlides(pdfUrl: string) {
//   // 🚨 Must be inside the function
//   const pdfjs = await import('pdfjs-dist/build/pdf')
//   const worker = await import('pdfjs-dist/build/pdf.worker.entry')

//   pdfjs.GlobalWorkerOptions.workerSrc = worker

//   const pdf = await pdfjs.getDocument(pdfUrl).promise
//   const slides: string[] = []

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i)
//     const viewport = page.getViewport({ scale: 2 })

//     const canvas = document.createElement('canvas')
//     const ctx = canvas.getContext('2d')!

//     canvas.width = viewport.width
//     canvas.height = viewport.height

//     await page.render({
//       canvasContext: ctx,
//       viewport,
//     }).promise

//     slides.push(canvas.toDataURL('image/jpeg'))
//   }

//   return slides
// }

export {}