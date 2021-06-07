import React, { useContext } from 'react'

import flag from 'cozy-flags'
import { DialogContent } from 'cozy-ui/transpiled/react/Dialog'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import useConfig from 'drive/web/modules/views/OnlyOffice/useConfig'
import View from 'drive/web/modules/views/OnlyOffice/View'
import Error from 'drive/web/modules/views/OnlyOffice/Error'
import Loading from 'drive/web/modules/views/OnlyOffice/Loading'
import Title from 'drive/web/modules/views/OnlyOffice/Title'
import { DEFAULT_EDITOR_TOOLBAR_HEIGHT } from 'drive/web/modules/views/OnlyOffice/config'

export const Editor = () => {
  const { config, status } = useConfig()
  const { isEditorForcedReadOnly } = useContext(OnlyOfficeContext)

  if (status === 'error') return <Error />
  if (status !== 'loaded' || !config) return <Loading />

  const { serverUrl, apiUrl, docEditorConfig } = config

  const editorToolbarHeight = Number.isInteger(
    flag('drive.onlyoffice.editorToolbarHeight')
  )
    ? flag('drive.onlyoffice.editorToolbarHeight')
    : DEFAULT_EDITOR_TOOLBAR_HEIGHT

  return (
    <>
      <Title />
      <DialogContent
        style={
          isEditorForcedReadOnly
            ? {
                marginTop: `-${editorToolbarHeight}px`
              }
            : undefined
        }
        className="u-flex u-flex-column u-p-0"
      >
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
