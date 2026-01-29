import fs from 'fs'
import path from 'path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const OUT_FILE = path.join(process.cwd(), 'public/assets.json')

const EXTENSIONS = /\.(jpg|jpeg|png|webp|webm)$/i

function walk(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath: string = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      walk(fullPath, fileList)
    } else if (EXTENSIONS.test(file)) {

      const genPath = path.relative(PUBLIC_DIR, fullPath) || ''

      const finPath: string = '/' + genPath.replace(/\\/g, '/')

      fileList.push(finPath)
    }
  }

  return fileList
}

const assets = walk(PUBLIC_DIR)

fs.writeFileSync(
  OUT_FILE,
  JSON.stringify(assets, null, 2)
)

// console.log(`✅ Generated ${assets.length} assets`)
