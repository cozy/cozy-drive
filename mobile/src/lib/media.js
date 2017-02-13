const hasCordovaPlugin = () => {
  return window.cordova !== undefined &&
    window.cordova.plugins !== undefined &&
    window.cordova.plugins.photoLibrary !== undefined
}

export const requestAuthorization = async () => {
  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.photoLibrary.requestAuthorization(
        () => resolve(true),
        (error) => {
          console.warn(error)
          resolve(false)
        }
      )
    })
  }
  return false
}

export const getBlob = async (libraryItem) => {
  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.photoLibrary.getPhoto(
        libraryItem,
        fullPhotoBlob => resolve(fullPhotoBlob),
        err => reject(err)
      )
    })
  }

  return ''
}

export const getPhotos = async () => {
  const defaultReturn = []

  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.photoLibrary.getLibrary(
        (library) => resolve(library),
        (err) => {
          if (err.startsWith('Permission')) {
            requestAuthorization().then(authorization => {
              if (authorization) {
                getPhotos().then(photos => resolve(photos))
              } else {
                resolve(defaultReturn)
              }
            })
          } else {
            console.warn(err)
            resolve(defaultReturn)
          }
        }
      )
    })
  }

  return defaultReturn
}
