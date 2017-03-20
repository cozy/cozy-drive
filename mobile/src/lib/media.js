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
        },
        {
          read: true
        }
      )
    })
  }
  return Promise.resolve(false)
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

  return Promise.resolve('')
}

export const getPhotos = async () => {
  const defaultReturn = []

  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.photoLibrary.getLibrary(
        (response) => resolve(response.library),
        (err) => {
          console.warn(err)
          if (err.startsWith('Permission')) {
            requestAuthorization().then(authorization => {
              if (authorization) {
                getPhotos().then(photos => resolve(photos))
              } else {
                resolve(defaultReturn)
              }
            }).catch(err => {
              console.warn(err)
              resolve(defaultReturn)
            })
          } else {
            console.warn(err)
            resolve(defaultReturn)
          }
        }
      )
    })
  }

  return Promise.resolve(defaultReturn)
}

export const getFilteredPhotos = async () => {
  let photos = await getPhotos()

  if (hasCordovaPlugin() && window.cordova.platformId === 'android') {
    photos = photos.filter((photo) => photo.id.indexOf('DCIM') !== -1)
  }

  return Promise.resolve(photos)
}

export const canStartBackup = (getState) => {
  // TODO: Add wifi parameter
  return getState().mobile.settings.backupImages
}
