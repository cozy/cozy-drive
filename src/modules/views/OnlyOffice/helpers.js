import flag from 'cozy-flags'
import { isMobile } from 'cozy-device-helper'

import FileTypeSheetIcon from 'cozy-ui/transpiled/react/Icons/FileTypeSheet'
import FileTypeSlideIcon from 'cozy-ui/transpiled/react/Icons/FileTypeSlide'
import FileTypeTextIcon from 'cozy-ui/transpiled/react/Icons/FileTypeText'

export const isOfficeEnabled = isDesktop => {
  const officeEnabled = flag(
    `drive.office.${!isDesktop || isMobile() ? 'touchScreen.' : ''}enabled`
  )
  if (officeEnabled !== null) {
    return officeEnabled
  }

  // Keeping compatibility with the old flag but with a lower priority
  if (flag('drive.onlyoffice.enabled')) return true

  return false
}

export function canWriteOfficeDocument() {
  const officeWrite = flag('drive.office.write')
  if (officeWrite !== null) {
    return officeWrite
  }

  // Keeping compatibility with the old flag but with a lower priority
  if (flag('drive.onlyoffice.enabled')) return true

  return false
}

export function officeDefaultMode(isDesktop, isMobile) {
  if (!isDesktop && flag('drive.office.touchScreen.readOnly')) {
    return 'view'
  }

  const canWrite = canWriteOfficeDocument()

  const mobileDefaultMode = flag('drive.office.mobile.defaultMode')
  if (isMobile && canWrite && mobileDefaultMode !== null) {
    return mobileDefaultMode
  }

  const defaultMode = flag('drive.office.defaultMode')
  if (canWrite && defaultMode !== null) {
    return defaultMode
  }

  return 'view'
}

export const isOfficeEditingEnabled = isDesktop => {
  if (!isOfficeEnabled(isDesktop)) {
    return false
  }

  if ((!isDesktop || isMobile()) && flag('drive.office.touchScreen.readOnly')) {
    return false
  }

  return true
}

/**
 * Make hash to redirect user to an OnlyOffice file
 * @param {string} fileId Id of the OnlyOffice file
 * @param {object} options
 * @param {boolean} options.withoutRouter To return an path without the hash prefix
 * @param {boolean} options.fromCreate The document will be opened in edit mode
 * @param {boolean} options.fromPathname Hash to redirect the user when he back
 * @param {boolean} options.fromRedirect To forward existing redirectLink
 * @param {boolean} options.fromEdit The document will be opened in edit mode
 * @param {boolean} options.fromPublicFolder The document is opened from a public folder
 * @returns {string} Path to OnlyOffice
 */
export const makeOnlyOfficeFileRoute = (
  fileId,
  {
    withoutRouter = false,
    fromCreate = false,
    fromPathname,
    fromRedirect,
    fromEdit = false,
    fromPublicFolder = false
  } = {}
) => {
  const params = new URLSearchParams()
  if (fromCreate) {
    params.append('fromCreate', true)
  }
  if (fromPathname) {
    params.append('redirectLink', `drive#${fromPathname}`)
  }
  if (fromRedirect) {
    params.append('redirectLink', fromRedirect)
  }
  if (fromEdit) {
    params.append('fromEdit', fromEdit)
  }
  if (fromPublicFolder) {
    params.append('fromPublicFolder', fromPublicFolder)
  }
  const searchParam = params.size > 0 ? `?${params.toString()}` : ''
  return withoutRouter
    ? `/#/onlyoffice/${fileId}${searchParam}`
    : `/onlyoffice/${fileId}${searchParam}`
}

/**
 * Returns true in case of the document is shared and should be opened on another instance.
 * See https://docs.cozy.io/en/cozy-stack/office/#get-officeidopen
 * @param {object} params - Result of `/office/fileId/open`
 * @param {string} instanceUri - Current instanceUri
 * @returns {boolean}
 */
export const shouldBeOpenedOnOtherInstance = ({ data }, instanceUri) => {
  return !!instanceUri && !instanceUri.includes(data.attributes.instance)
}

export const makeOnlyOfficeIconByClass = fileClass => {
  const iconByClass = {
    spreadsheet: FileTypeSheetIcon,
    slide: FileTypeSlideIcon,
    text: FileTypeTextIcon
  }

  return iconByClass[fileClass]
}

export const makeExtByClass = fileClass => {
  const extByClass = {
    text: 'docx',
    spreadsheet: 'xlsx',
    slide: 'pptx'
  }

  return extByClass[fileClass]
}

export const makeMimeByClass = fileClass => {
  // see https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  const mimeByClass = {
    text: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    spreadsheet:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    slide:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  }

  return mimeByClass[fileClass]
}

// The sharing banner need to be shown only on the first arrival
// and not after browsing inside a folder
// When it comes from cozy to cozy sharing, we don't want the banner at all
export const showSharingBanner = ({
  isFromSharing,
  isPublic,
  isInSharedFolder
}) => {
  return (
    !isFromSharing &&
    isPublic &&
    (isInSharedFolder ? window.history.length <= 1 : window.history.length <= 2)
  )
}

/**
 * Make username to use in the Only office editor in order to show the name
 * when adding comment or moving the cursor for example
 * @param {object} params - Params
 * @param {boolean} params.isPublic - Whether the route is public (like /public)
 * @param {boolean} params.isFromSharing - Whether the doc is shared from cozy to cozy
 * @param {string} params.username - The name of the sharing recipient
 * @param {string} params.public_name - The name of the owner
 * @returns {string|undefined}
 */
export const makeName = ({ isPublic, isFromSharing, username, public_name }) =>
  isPublic && !isFromSharing ? undefined : username ? username : public_name
