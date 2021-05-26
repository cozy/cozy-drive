import React from 'react'

import { DialogContent } from 'cozy-ui/transpiled/react/Dialog'

import useConfig from 'drive/web/modules/views/OnlyOffice/useConfig'

import View from 'drive/web/modules/views/OnlyOffice/View'
import Error from 'drive/web/modules/views/OnlyOffice/Error'
import Loading from 'drive/web/modules/views/OnlyOffice/Loading'
import Title from 'drive/web/modules/views/OnlyOffice/Title'

export const Editor = () => {
  const { config, status } = useConfig()

  if (status === 'error') return <Error />
  if (status !== 'loaded' || !config) return <Loading />

  const { serverUrl, apiUrl, docEditorConfig } = config

  return (
    <>
      <Title />
      <DialogContent className="u-flex u-flex-column u-p-0">
        <View
          id={new URL(serverUrl).hostname}
          apiUrl={apiUrl}
          docEditorConfig={docEditorConfig}
        />
      </DialogContent>
    </>
  )
}

export default Editor
