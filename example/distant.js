const noelshack = require('..')

async function upload () {
  const url = await noelshack.uploadFromUrl('https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png')
  console.log('picture uploaded at', url.direct)
  console.log(url)
}

upload()
.catch(err => {
  console.error('Whoops an error has occurred')
  console.error(err)
})