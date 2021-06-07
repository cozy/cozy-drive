import flag from 'cozy-flags'
import FileTypeSheetIcon from 'cozy-ui/transpiled/react/Icons/FileTypeSheet'
import FileTypeSlideIcon from 'cozy-ui/transpiled/react/Icons/FileTypeSlide'
import FileTypeTextIcon from 'cozy-ui/transpiled/react/Icons/FileTypeText'

export const isOnlyOfficeEnabled = () => flag('drive.onlyoffice.enabled')

export const makeOnlyOfficeFileRoute = (file, isWithRouter) =>
  isWithRouter ? `/onlyoffice/${file.id}` : `/#/onlyoffice/${file.id}`

export const isOnlyOfficeReadOnly = ({ data }) =>
  data.attributes.onlyoffice.editor.mode === 'view'

/**
 * Returns true in case of the document is shared and should be opened on another instance.
 * See https://docs.cozy.io/en/cozy-stack/office/#get-officeidopen
 * @param {object} params - Result of `/office/fileId/open`
 * @returns {boolean}
 */
export const shouldBeOpenedOnOtherInstance = ({ data }) =>
  data.attributes.sharecode

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
    text:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
