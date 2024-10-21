import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const filesPath = path.resolve(import.meta.dirname, "files.json");
const filesContent = fs.readFileSync(filesPath, "utf8");
const files = JSON.parse(filesContent);

/**
 * @param {string} file
 */
async function md5(file) {
  const stream = fs.createReadStream(path.resolve(import.meta.dirname, file));
  const hash = crypto.createHash("md5");
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      hash.update(chunk, "utf8");
    });
    stream.on("end", () => {
      const md5 = hash.digest("hex");
      resolve(md5);
    });
    stream.on("error", () => {
      reject(Error(`Failed to get md5 of file ${file}`));
    });
  });
}

const [source, version] = process.argv.slice(2);

if (!source || !version) {
  console.log("Unkonwn source or version.");
  console.log("eg:");
  console.log("\tnode copy.mjs public/libs/3.0.0-4020920240930001 3.0.0-4020920240930001");
  console.log("\tnode copy.mjs ~/Android-SDK@4.28.82186_20240923/SDK/libs 3.0.0-4020920240930001");
  process.exit(0);
}

const sourcePath = path.resolve(import.meta.dirname, source);

const sourceFiles = fs.readdirSync(sourcePath);

const targetPath = path.resolve(import.meta.dirname, `public/libs/${version}`);

const isSamePath = sourcePath === targetPath;

if (!isSamePath) {
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
}

const targetList = {};

for (const file of sourceFiles) {
  if (file === "index.json") continue;
  const sourceFilePath = path.join(sourcePath, file);
  const md5string = await md5(sourceFilePath);
  if (isSamePath) {
    files[md5string] = `${version}/${file}`;
    targetList[file] = files[md5string];
  } else {
    if (files[md5string]) {
      targetList[file] = files[md5string];
    } else {
      const targetFilePath = path.join(targetPath, file);
      fs.cpSync(sourceFilePath, targetFilePath);
      files[md5string] = `${version}/${file}`;
      targetList[file] = files[md5string];
    }
  }
}

fs.writeFileSync(path.join(targetPath, "index.json"), JSON.stringify(targetList), "utf8");

fs.writeFileSync(path.resolve(import.meta.dirname, "files.json"), JSON.stringify(files, null, 2), "utf8");
