import puppeteer from 'puppeteer';
import fs from 'node:fs/promises'

// EXAMPLE RUN
// pnpm node scrape/index.mjs jjk https://tiermaker.com/create/jujutsu-kaisen-all-characters-anime-971232

const shortname = process.argv[2]
const url = process.argv[3]

const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();

await page.goto(url);
await page.setViewport({ width: 1080, height: 1024 });
await page.waitForSelector('#create-image-carousel')

const images = await page.evaluate(() => Array.from(document.images, e => e.src));

const imageBuffers = []
for (let image of images) {
  if (!image.match(/(chart|media|template_images)/g)?.length > 0) continue

  const viewSource = await page.goto(image);
  const buffer = await viewSource.buffer();
  imageBuffers.push(buffer);
  await fs.writeFile(`./src/assets/${shortname}/${image.split('/').pop()}`, await viewSource.buffer())
}

await browser.close();