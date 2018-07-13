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
  const body = await request(`http://www.noelshack.com/telecharger.json?url=${encodeURIComponent(url)}`, { json: true })
  if (body.erreurs && body.erreurs !== 'null') {
    if (locale.has(body.erreurs[0])) {
      throw new Error(locale.get(body.erreurs[0]))
    } else {
      throw new Error(body.erreurs[0])
    }
  }
  return new NoelshackImage(body.chats)
}

module.exports = {
  uploadFromFs,
  uploadFromUrl
}