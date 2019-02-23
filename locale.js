const locale = new Map()

locale.set(`Le type du fichier n'est pas autorisé !`, `filetype not authorized (expect png, jpg, jpeg, gif)`)
locale.set(`Le fichier n'a pas pu être récupéré`, `could not get provided file`)
locale.set(`url non valide ou fichier image corrompu !`, `bad url or corrupted file`)
locale.set(`Impossible d'initialiser le téléchargement ou ce type de fichier n'est pas autorisé`, `download failed or bad file type`)

module.exports = locale