const fs = require("fs")
const path = require("path")
const glob = require("glob")
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

// Find all source images
const src = glob.sync(inputPattern)

if (src.length === 0) {
  console.error(`No PNG files found for pattern: ${inputPattern}`)
  process.exit(1)
}

// Parse output path
// Example:
// outputPathArg = "sts2/badges"

const outputDir = path.dirname(outputPathArg) // "sts2"
const outputName = path.basename(outputPathArg) // "badges"

// Final output directories
const imageOutputDir = path.join(imageBaseDir, outputDir)
const cssOutputDir = path.join(cssBaseDir, outputDir)

// Create directories automatically
fs.mkdirSync(imageOutputDir, { recursive: true })
fs.mkdirSync(cssOutputDir, { recursive: true })

// Final file paths
const spriteFilename = `${outputName}.png`
const cssFilename = `${outputName}.css`

const spriteOutputPath = path.join(imageOutputDir, spriteFilename)

const cssOutputPath = path.join(cssOutputDir, cssFilename)

Spritesmith.run(
  {
    src,
    padding: 2,
  },
  (err, result) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    // Write sprite image
    fs.writeFileSync(spriteOutputPath, result.image)

    // Compute relative CSS → image path
    const relativeImagePath = path
      .relative(cssOutputDir, spriteOutputPath)
      .replace(/\\/g, "/")

    // Generate CSS
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

    // Write CSS file
    fs.writeFileSync(cssOutputPath, css)

    console.log(`
Sprite generated successfully!

Sprite:
${spriteOutputPath}

CSS:
${cssOutputPath}
`)
  },
)
