import flag from 'cozy-flags'

export const isOnlyOfficeEnabled = () => flag('drive.onlyoffice.enabled')

export const makeOnlyOfficeFileRoute = (file, isWithRouter) =>
  isWithRouter ? `/onlyoffice/${file.id}` : `/#/onlyoffice/${file.id}`

export const isOnlyOfficeReadOnly = ({ data }) =>
  data.attributes.onlyoffice.editor.mode === 'view'

export const makeConfig = ({ data }) => {
  const onlyOffice = data.attributes.onlyoffice
  const serverUrl = onlyOffice.url
  const apiUrl = `${serverUrl}/web-apps/apps/api/documents/api.js`

  // complete config doc : https://api.onlyoffice.com/editors/advanced
  const docEditorConfig = {
    document: onlyOffice.document,
    editorConfig: onlyOffice.editor,
    token: onlyOffice.token,
    documentType: onlyOffice.documentType
  }

  return { serverUrl, apiUrl, docEditorConfig }
}
