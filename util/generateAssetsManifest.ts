import fs from 'fs'
import path from 'path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

// ---- assets ----
const ASSETS_OUT = path.join(PUBLIC_DIR, 'assets.json')
const ASSET_EXTENSIONS = /\.(jpg|jpeg|png|webp|webm)$/i

// ---- websites ----
const WEBSITES_DIR = path.join(PUBLIC_DIR, 'websites')
const WEBSITES_OUT = path.join(PUBLIC_DIR, 'websites.json')

/* -------------------------------- assets -------------------------------- */

function walkAssets(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      walkAssets(fullPath, fileList)
    } else if (ASSET_EXTENSIONS.test(file)) {
      const rel = path.relative(PUBLIC_DIR, fullPath)
      fileList.push('/' + rel.replace(/\\/g, '/'))
    }
  }

  return fileList
}

/* ------------------------------- websites ------------------------------- */

function walkWebsites(dir: string, result: Record<string, string> = {}) {
  const files = fs.readdirSync(dir)

  // if this directory contains index.html → website root
  if (files.includes('index.html')) {
    const rel = path.relative(PUBLIC_DIR, dir).replace(/\\/g, '/')
    result[rel.replace(/^websites\//, '')] = `/${rel}/index.html`
    return result
  }

  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      walkWebsites(fullPath, result)
    }
  }

  return result
}

/* -------------------------------- run -------------------------------- */

const assets = walkAssets(PUBLIC_DIR)
const websites = walkWebsites(WEBSITES_DIR)

fs.writeFileSync(ASSETS_OUT, JSON.stringify(assets, null, 2))
fs.writeFileSync(WEBSITES_OUT, JSON.stringify(websites, null, 2))

console.log('✓ assets.json generated')
console.log('✓ websites.json generated')


// import fs from 'fs'
// import path from 'path'

// const PUBLIC_DIR = path.join(process.cwd(), 'public')
// const OUT_FILE = path.join(process.cwd(), 'public/websites.json')

// const EXTENSIONS = /\.(jpg|jpeg|png|webp|webm)$/i

// function walk(dir: string, fileList: string[] = []) {
//   const files = fs.readdirSync(dir)

//   for (const file of files) {
//     const fullPath: string = path.join(dir, file)
//     const stat = fs.statSync(fullPath)

//     if (stat.isDirectory()) {
//       walk(fullPath, fileList)
//     } else if (EXTENSIONS.test(file)) {

//       const genPath = path.relative(PUBLIC_DIR, fullPath) || ''

//       const finPath: string = '/' + genPath.replace(/\\/g, '/')

//       fileList.push(finPath)
//     }
//   }

//   return fileList
// }

// const assets = walk(PUBLIC_DIR)

// fs.writeFileSync(
//   OUT_FILE,
//   JSON.stringify(assets, null, 2)
// )