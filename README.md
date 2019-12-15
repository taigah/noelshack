# Noelshack Node.js API 1.0.2

## Installation

```bash
yarn add noelshack
```

## CLI

```
noelshack [url/path]
```

## Usage

Upload a local file to noelshack

```javascript
const noelshack = require('noelshack')

async function upload () {
  const url = await noelshack.uploadFromFs('path/to/local/image.png')
  console.log('picture uploaded at', url.direct)
}

upload()
.catch(err => {
  console.error('Whoops an error has occurred')
  console.error(err)
})
```

or using a stream

```javascript
const noelshack = require('noelshack')
const fs = require('fs')

async function upload () {
  const readStream = fs.createReadStream('path/to/local/image.png')
  const url = await noelshack.uploadFromStream(readStream)
  console.log('picture uploaded at', url.direct)
}

upload()
.catch(err => {
  console.error('Whoops an error has occurred')
  console.error(err)
})
```

Upload a distant file to noelshack

```javascript
const noelshack = require('noelshack')

async function upload () {
  const url = await noelshack.uploadFromUrl('https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png')
  console.log('picture uploaded at', url.direct)
}

upload()
.catch(err => {
  console.error('Whoops an error has occurred')
  console.error(err)
})
```

## API

- `NoelshackImage`
- - `original` (String) original url given by the API (example: `https://www.noelshack.com/2018-28-5-1531505613-new-google-favicon-128.png`)
- - `direct` (String) direct to the file (example: `https://image.noelshack.com/fichiers/2018/28/5/1531505613-new-google-favicon-128.png`)
- - `thumb` (String) direct url to the file's thumbnail (example: `https://image.noelshack.com/minis/2018/28/5/1531505613-new-google-favicon-128.png`)

- `uploadFromFs` (`path`: String): Promise<`image`: NoelshackImage>

Upload a local file to noelshack and returns a promise fulfilled with the uploaded file URL

Will throw if the given file does not exist

Will throw if the upload fails

- `uploadFromUrl` (`url`: String): Promise<`image`: NoelshackImage>

Upload a distant file to noelshack and returns a promise fulfilled with the uploaded file URL

Will throw if the download fails

Will throw if the upload failed
