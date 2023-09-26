import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import Error from 'drive/web/modules/views/OnlyOffice/Error'
import { useOnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice/OnlyOfficeProvider'
import ReadOnlyFab from 'drive/web/modules/views/OnlyOffice/ReadOnlyFab'
import { isOfficeEditingEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'
import { FRAME_EDITOR_NAME } from 'drive/web/modules/views/OnlyOffice/config'

const forceIframeHeight = value => {
  const iframe = document.getElementsByName(FRAME_EDITOR_NAME)[0]
  if (iframe) iframe.style.height = value
}

const View = ({ id, apiUrl, docEditorConfig }) => {
  const [isError, setIsError] = useState(false)

  const { isEditorReady, isReadOnly, isEditorModeView } = useOnlyOfficeContext()
  const { isMobile, isDesktop } = useBreakpoints()

  const initEditor = useCallback(() => {
    new window.DocsAPI.DocEditor('onlyOfficeEditor', docEditorConfig)
    forceIframeHeight('0')
  }, [docEditorConfig])

  const handleError = useCallback(() => {
    const scriptNode = document.getElementById(id)
    scriptNode && scriptNode.remove()
    setIsError(true)
  }, [setIsError, id])

  useEffect(() => {
    const scriptAlreadyLoaded = document.getElementById(id)
    if (scriptAlreadyLoaded) return initEditor()

    const script = document.createElement('script')
    script.id = id
    script.src = apiUrl
    script.async = true
    script.onload = () => initEditor()
    script.onerror = () => handleError()

    document.body.appendChild(script)
  }, [id, apiUrl, initEditor, handleError])

  useEffect(() => {
    if (isEditorReady) {
      forceIframeHeight('100%')
    }
  }, [isEditorReady])

  const showReadOnlyFab =
    isEditorReady &&
    !isReadOnly &&
    isOfficeEditingEnabled(isDesktop) &&
    (isMobile || isEditorModeView)

  if (isError) return <Error />

  return (
    <>
      {!isEditorReady && (
        <div className="u-flex u-flex-items-center u-flex-justify-center u-flex-grow-1">
          <Spinner size="xxlarge" />
        </div>
      )}
      <div id="onlyOfficeEditor" />
      {showReadOnlyFab && <ReadOnlyFab />}
    </>
  )
}

View.propTypes = {
  id: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  docEditorConfig: PropTypes.object.isRequired
}

export default React.memo(View)
