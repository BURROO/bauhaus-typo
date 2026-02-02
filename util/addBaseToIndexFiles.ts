import fs from "fs";
import path from "path";

// const root = "public/websites/tt";
const root_pz = "public/websites/pz";
const root_tt = "public/websites/tt";


const handleDir = (root: string) => {
  for (const dir of fs.readdirSync(root)) {

  if(dir.match("wunderle")) return;

    const index = path.join(root, dir, "index.html");
    if (!fs.existsSync(index)) continue;

    let html = fs.readFileSync(index, "utf8");

    const subDir = root.split('/').pop(); // "pz" oder "tt"

    // console.log(subDir)
    const baseTag = `<base href="/websites/${subDir}/${dir}/">`;

    if (html.includes("<base")) {
      // replace existing <base ...> with the new one
      html = html.replace(/<base\s+href="[^"]*"\s*\/?>/i, baseTag);
    } else {
      // insert <base> right after <head>
      html = html.replace("<head>", `<head>\n${baseTag}`);
    }

    fs.writeFileSync(index, html);
    console.log(`✅ Updated base tag for ${dir}`);
  }
};

handleDir(root_pz)
handleDir(root_tt)


//  node ./util/addBaseToIndexFiles.ts
