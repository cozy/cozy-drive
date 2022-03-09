import flag from 'cozy-flags'

export const initFlags = () => {
  let activateFlags = flag('switcher') === true ? true : false

  if (process.env.NODE_ENV !== 'production' && flag('switcher') === null) {
    activateFlags = true
  }

  const searchParams = new URL(window.location).searchParams
  if (!activateFlags && searchParams.get('flags') !== null) {
    activateFlags = true
  }

  if (activateFlags) {
    flagsList()
  }
}

const flagsList = () => {
  flag('switcher', true)
  flag('viewer-bottomSheet-tension')
  flag('viewer-bottomSheet-friction')
  flag('viewer-bottomSheet-clamp')
  flag('drive.onlyoffice.forceReadOnlyOnDesktop')
  flag('drive.onlyoffice.editorToolbarHeight')
  flag('drive.logger')
  flag('drive.enable-encryption')
}
