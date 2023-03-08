import flag from 'cozy-flags'
import FileTypeSheetIcon from 'cozy-ui/transpiled/react/Icons/FileTypeSheet'
import FileTypeSlideIcon from 'cozy-ui/transpiled/react/Icons/FileTypeSlide'
import FileTypeTextIcon from 'cozy-ui/transpiled/react/Icons/FileTypeText'

export const isOfficeEnabled = () => {
  const office = flag('drive.office')
  if (flag('drive.onlyoffice.enabled') || (office && office.enabled)) {
    return true
  }
  return false
}

export function canWriteOfficeDocument() {
  const office = flag('drive.office')
  if (office) {
    return office.write
  }
  return false
}

export function redirectToOnlyOfficePaywall(nextState, replace) {
  if (!canWriteOfficeDocument()) {
    replace({
      pathname: `/folder/${nextState.params.folderId}/paywall`
    })
  }
}

export function onlyOfficeDefaultMode() {
  const office = flag('drive.office')
  if (office && office.write && office.onlyOffice) {
    return office.onlyOffice.defaultMode
  }
  return 'view'
}

export const makeOnlyOfficeFileRoute = (file, isWithRouter) =>
  isWithRouter ? `/onlyoffice/${file.id}` : `/#/onlyoffice/${file.id}`

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
