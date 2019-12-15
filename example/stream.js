const fs = require('fs')
const noelshack = require('..')

async function upload () {
  const stream = fs.createReadStream('image.png')
  const url = await noelshack.uploadFromStream(stream)
  console.log('picture uploaded at', url.direct)
}

upload()
.catch(err => {
  console.error('Whoops an error has occurred')
  console.error(err)
})