import React, { useContext } from 'react'

import flag from 'cozy-flags'
import { DialogContent } from 'cozy-ui/transpiled/react/Dialog'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import useConfig from 'drive/web/modules/views/OnlyOffice/useConfig'
import View from 'drive/web/modules/views/OnlyOffice/View'
import Error from 'drive/web/modules/views/OnlyOffice/Error'
import Loading from 'drive/web/modules/views/OnlyOffice/Loading'
import Title from 'drive/web/modules/views/OnlyOffice/Title'
import {
  DEFAULT_EDITOR_TOOLBAR_HEIGHT_IOS,
  DEFAULT_EDITOR_TOOLBAR_HEIGHT
} from 'drive/web/modules/views/OnlyOffice/config'
import { isIOS } from 'cozy-device-helper'

const getEditorToolbarHeight = editorToolbarHeightFlag => {
  if (Number.isInteger(editorToolbarHeightFlag)) {
    return editorToolbarHeightFlag
  } else if (isIOS()) {
    return DEFAULT_EDITOR_TOOLBAR_HEIGHT_IOS
  } else {
    return DEFAULT_EDITOR_TOOLBAR_HEIGHT
  }
}

export const Editor = () => {
  const { config, status } = useConfig()
  const { isEditorForcedReadOnly } = useContext(OnlyOfficeContext)

  if (status === 'error') return <Error />
  if (status !== 'loaded' || !config) return <Loading />

  const { serverUrl, apiUrl, docEditorConfig } = config

  const editorToolbarHeight = getEditorToolbarHeight(
    flag('drive.onlyoffice.editorToolbarHeight')
  )
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
