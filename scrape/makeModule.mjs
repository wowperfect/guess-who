import fs from 'node:fs/promises'

const shortname = process.argv[2]

let files = await fs.readdir(`./src/assets/${shortname}/`)
files = files.filter(f => !f.startsWith('.'))
const lines1 = files.map(
  (f, i) => `import img${i} from './${shortname}/${f}'`
)
const lines2 = files.map(
  (f, i) => `export let character${i} = img${i}`
)

const code1 = lines1.join('\n')
const code2 = lines2.join('\n')
const code = code1 + '\n' + code2
await fs.writeFile(`./src/assets/${shortname}.js`, code)
