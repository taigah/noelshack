const noelshack = require('./index')
const arg = process.argv[2]

const isUrl = arg.startsWith('http')
console.log(`uploading from ${isUrl ? 'url' : 'file'}`)

const upload = isUrl ? noelshack.uploadFromUrl : noelshack.uploadFromFs

upload(arg)
.then(image => {
  console.log(image.direct)
})
.catch(err => {
  console.error(err)
  process.exit(1)
})