import React from 'react'
import PropTypes from 'prop-types'

import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'
import { DialogContent } from 'cozy-ui/transpiled/react/Dialog'

import View from 'drive/web/modules/views/OnlyOffice/View'
import Error from 'drive/web/modules/views/OnlyOffice/Error'
import Loading from 'drive/web/modules/views/OnlyOffice/Loading'
import Title from 'drive/web/modules/views/OnlyOffice/Title'

export const Editor = ({ fileId }) => {
  const { data, fetchStatus } = useFetchJSON('GET', `/office/${fileId}/open`)

  if (fetchStatus === 'pending' || fetchStatus === 'loading') return <Loading />
  if (fetchStatus === 'error') return <Error />

  const onlyOffice = data.data.attributes.onlyoffice
  const serverUrl = onlyOffice.url
  const apiUrl = `${serverUrl}/web-apps/apps/api/documents/api.js`

  // complete config doc : https://api.onlyoffice.com/editors/advanced
  const config = {
    document: onlyOffice.document,
    editorConfig: onlyOffice.editor,
    token: onlyOffice.token,
    documentType: onlyOffice.documentType
  }

  return (
    <>
      <Title />
      <DialogContent className="u-p-0">
        <View
          id={new URL(serverUrl).hostname}
          apiUrl={apiUrl}
          config={config}
        />
      </DialogContent>
    </>
  )
}

Editor.propTypes = {
  fileId: PropTypes.string.isRequired
}

export default Editor
