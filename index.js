const http = require('https')
const urlModule = require('url')
const pathModule = require('path')
const fs = require('fs')
const os = require('os')
const request = require('request-promise-native')
const { promisify } = require('util')
const locale = require('./locale')

class NoelshackImage {
  constructor (url) {
    if (url.slice(0, 5) !== 'https') {
      this.original = url.replace('http', 'https')
    } else {
      this.original = url
    }
    const parts = this.original.match(/^https:\/\/www\.noelshack\.com\/([0-9]{4})-([0-9]+)-([0-9]+)-(.+)$/)
    if (parts === null) throw new Error(`NoelshackImage.constructor: bad url format (the 'noelshack' module may need an update)`)
    this.direct = `https://image.noelshack.com/fichiers/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}`
    this.thumb = `https://image.noelshack.com/minis/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}`
  }
}

async function uploadFromFs (path) {
  if (!path instanceof String) throw new Error(`noelshack.uploadFromFs: 'path' must be a string`)
  try {
    await promisify(fs.access)(path)
  } catch (err) {
    throw new Error(`noelshack.uploadFromFs: provided file does not exist (${path}}`)
  }

  const body = await request('http://www.noelshack.com/api.php', {
    method: 'POST',
    formData: {
      fichier: fs.createReadStream(path)
    }
  })
  // an error has occurred during the upload
  if (body.slice(0, 4) !== 'http') {
    if (locale.has(body)) {
      throw new Error(`noelshack.uploadFromFs: ${locale.get(body)}`)
    } else {
      throw new Error(`noelshack.uploadFromFs: an unexpected error has occurred during the upload (${body})`)
    }
  }
  return new NoelshackImage(body)
}

async function uploadFromUrl (url) {
  return new Promise((resolve, reject) => {
    const urlParts = urlModule.parse(url)
    const filename = pathModule.parse(url).name
    const downloadPath = pathModule.join(os.tmpdir(), filename)
    const req = http.get(url, res => {
      res.pipe(fs.createWriteStream(downloadPath))
      if (res.statusCode >= 400) {
        res.connection.end()
        switch (res.statusCode) {
          case 404:
          return reject(new Error(`noelshack.uploadFromUrl: 404 file not found`))
          default:
            return reject(new Error(`noelshack.uploadFromUrl: http error code while downloading (${res.statusCode})`))
        }
      }
      res.on('end', async () => {
        // file downloaded, let's upload it
        try {
          const url = await uploadFromFs(downloadPath)
          // upload is successful, let's remove local file
          await promisify(fs.unlink)(downloadPath)
          resolve(url)
        } catch (err) {
          reject(err)
        }
      })
      res.on('error', reject)
    })
    req.on('error', reject)
  })
}

module.exports = {
  uploadFromFs,
  uploadFromUrl
}