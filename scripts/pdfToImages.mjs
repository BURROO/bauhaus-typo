// import { fromPath } from 'pdf2pic';
// import path from 'path';

// async function convert() {
//   const pdfPath = path.resolve('public/images/ioom/content/mona_kerntke_content.pdf');

//   const convert = fromPath(pdfPath, {
//     density: 200,
//     savePath: 'public/images/ioom/content',
//     format: 'png',
//   });

//   await convert.bulk(-1);
// }

// convert();



// Run this line!!!

// pdftoppm public/images/ioom/content/mona_kerntke_content.pdf public/images/ioom/slides/slide -png


import { fromPath } from 'pdf2pic';
import path from 'path';
import fs from 'fs';
import gm from 'gm';

// 👇 THIS IS THE FIX
gm.subClass({ imageMagick: true });

const root = process.cwd();

const pdfPath = path.join(
  root,
  'public/images/ioom/content/mona_kerntke_content.pdf'
);

const outputDir = path.join(
  root,
  'public/images/ioom/slides'
);

if (!fs.existsSync(pdfPath)) {
  console.error('PDF not found:', pdfPath);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const convert = fromPath(pdfPath, {
  density: 200,
  savePath: outputDir,
  format: 'png',
  saveFilename: 'slide',
});

await convert.bulk(-1);

console.log('PDF converted successfully');
