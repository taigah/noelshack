const noelshack = require('..')

async function upload () {
  const url = await noelshack.uploadFromFs('image.png')
  console.log('picture uploaded at', url.direct)
}

upload()
.catch(err => {
  console.error('Whoops an error has occurred')
  console.error(err)
})