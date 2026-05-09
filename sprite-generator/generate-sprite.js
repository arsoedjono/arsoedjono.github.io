const fs = require("fs")
const path = require("path")
const glob = require("glob")
const sharp = require("sharp")
const Spritesmith = require("spritesmith")

// Usage:
// node generate-sprite.js "sts2/img/badges/*.png" "sts2/badges"

const inputPattern = process.argv[2]
const outputPathArg = process.argv[3]

if (!inputPattern || !outputPathArg) {
  console.error(`
Usage:
node generate-sprite.js "<images-glob>" "<output-path>"

Example:
node generate-sprite.js "sts2/img/badges/*.png" "sts2/badges"
`)
  process.exit(1)
}

const imageBaseDir = "assets/images"
const cssBaseDir = "assets/stylesheets"

const src = glob.sync(inputPattern)

if (src.length === 0) {
  console.error(`No PNG files found for pattern: ${inputPattern}`)
  process.exit(1)
}

const outputDir = path.dirname(outputPathArg)
const outputName = path.basename(outputPathArg)

const imageOutputDir = path.join(imageBaseDir, outputDir)
const cssOutputDir = path.join(cssBaseDir, outputDir)

fs.mkdirSync(imageOutputDir, { recursive: true })
fs.mkdirSync(cssOutputDir, { recursive: true })

const spriteFilename = `${outputName}.png`
const cssFilename = `${outputName}.css`

const spriteOutputPath = path.join(imageOutputDir, spriteFilename)
const cssOutputPath = path.join(cssOutputDir, cssFilename)

// Temp resized folder
const tempDir = path.join(".sprite-temp", outputDir, outputName)

async function prepareImages() {
  fs.mkdirSync(tempDir, { recursive: true })

  // Read all metadata
  const metadataList = await Promise.all(
    src.map(async (file) => {
      const meta = await sharp(file).metadata()

      return {
        file,
        width: meta.width,
        height: meta.height,
      }
    }),
  )

  // Find smallest dimensions
  const minWidth = Math.min(...metadataList.map((m) => m.width))
  const minHeight = Math.min(...metadataList.map((m) => m.height))

  console.log(`
Using normalized sprite size:
${minWidth}x${minHeight}
`)

  // Resize all images
  const resizedFiles = []

  for (const item of metadataList) {
    const outputFile = path.join(tempDir, path.basename(item.file))

    await sharp(item.file)
      .resize(minWidth, minHeight, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(outputFile)

    resizedFiles.push(outputFile)
  }

  return resizedFiles
}

async function generate() {
  const normalizedSrc = await prepareImages()

  Spritesmith.run(
    {
      src: normalizedSrc,
      padding: 2,
    },
    (err, result) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }

      fs.writeFileSync(spriteOutputPath, result.image)

      const relativeImagePath = path
        .relative(cssOutputDir, spriteOutputPath)
        .replace(/\\/g, "/")

      let css = ""

      for (const file in result.coordinates) {
        const coords = result.coordinates[file]

        const name = path
          .basename(file, ".png")
          .replace(/\s+/g, "-")
          .toLowerCase()

        css += `
.badge-${name} {
  background-image: url('${relativeImagePath}');
  background-position: -${coords.x}px -${coords.y}px;
  background-repeat: no-repeat;
  width: ${coords.width}px;
  height: ${coords.height}px;
  display: inline-block;
}
`
      }

      fs.writeFileSync(cssOutputPath, css)

      // Cleanup temp directory
      fs.rmSync(tempDir, {
        recursive: true,
        force: true,
      })

      console.log(`
Sprite generated successfully!

Sprite:
${spriteOutputPath}

CSS:
${cssOutputPath}

Temporary files cleaned:
${tempDir}
`)
    },
  )
}

generate()
