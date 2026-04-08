const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MAPS_DIR = path.join(__dirname, "..", "maps");
const CLEAN_DIR = path.join(__dirname, "..", "maps-clean");
const THUMBS_DIR = path.join(__dirname, "..", "public", "images", "thumbs");
const LARGE_DIR = path.join(__dirname, "..", "public", "images", "large");

const THUMB_WIDTH = 300;
const LARGE_WIDTH = 1200;

// Load catalog to map image filenames to item IDs
const catalog = require(path.join(__dirname, "..", "catalog.json"));
const imageToId = {};
catalog.forEach((item) => {
  imageToId[item.image] = item.id;
});

function getSourcePath(filename) {
  // Check if we have a clean version (named by item ID)
  const itemId = imageToId[filename];
  if (itemId) {
    const cleanPath = path.join(CLEAN_DIR, itemId + ".jpg");
    if (fs.existsSync(cleanPath)) {
      return { path: cleanPath, source: "clean" };
    }
  }
  // Fall back to original photo
  return { path: path.join(MAPS_DIR, filename), source: "original" };
}

async function processImage(filename) {
  const { path: inputPath, source } = getSourcePath(filename);
  const baseName = path.parse(filename).name + ".jpg";

  try {
    // Generate thumbnail — resize and crop to 4:3 aspect ratio
    await sharp(inputPath)
      .resize(THUMB_WIDTH, Math.round(THUMB_WIDTH * (3 / 4)), {
        fit: "cover",
        position: "centre",
      })
      .jpeg({ quality: 80 })
      .toFile(path.join(THUMBS_DIR, baseName));

    // Generate large version — resize preserving aspect ratio
    await sharp(inputPath)
      .resize(LARGE_WIDTH, null, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toFile(path.join(LARGE_DIR, baseName));

    const tag = source === "clean" ? "✓" : "~";
    console.log(`  ${tag} ${filename} (${source})`);
  } catch (err) {
    console.error(`  ✗ ${filename}: ${err.message}`);
  }
}

async function main() {
  fs.mkdirSync(THUMBS_DIR, { recursive: true });
  fs.mkdirSync(LARGE_DIR, { recursive: true });

  const files = fs
    .readdirSync(MAPS_DIR)
    .filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f));

  const cleanCount = files.filter((f) => {
    const id = imageToId[f];
    return id && fs.existsSync(path.join(CLEAN_DIR, id + ".jpg"));
  }).length;

  console.log(`Processing ${files.length} images (${cleanCount} clean, ${files.length - cleanCount} original)...\n`);

  for (const file of files) {
    await processImage(file);
  }

  console.log(`\nDone! Thumbnails in ${THUMBS_DIR}, large in ${LARGE_DIR}`);
}

main();
