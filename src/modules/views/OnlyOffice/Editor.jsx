import React from 'react'

import flag from 'cozy-flags'
import { DialogContent } from 'cozy-ui/transpiled/react/Dialog'
import { isIOS } from 'cozy-device-helper'

import { useOnlyOfficeContext } from 'modules/views/OnlyOffice/OnlyOfficeProvider'
import useConfig from 'modules/views/OnlyOffice/useConfig'
import View from 'modules/views/OnlyOffice/View'
import Error from 'modules/views/OnlyOffice/Error'
import Loading from 'modules/views/OnlyOffice/Loading'
import Title from 'modules/views/OnlyOffice/Title'
import {
  DEFAULT_EDITOR_TOOLBAR_HEIGHT_IOS,
  DEFAULT_EDITOR_TOOLBAR_HEIGHT
} from 'modules/views/OnlyOffice/config'
import { FileDivergedModal } from 'modules/views/OnlyOffice/components/FileDivergedModal'
import { FileDeletedModal } from 'modules/views/OnlyOffice/components/FileDeletedModal'

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
  const { isEditorModeView, hasFileDiverged, hasFileDeleted } =
    useOnlyOfficeContext()

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
          isEditorModeView
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
        {hasFileDiverged ? <FileDivergedModal /> : null}
        {hasFileDeleted ? <FileDeletedModal /> : null}
      </DialogContent>
    </>
  )
}

export default Editor
