import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import Error from 'drive/web/modules/views/OnlyOffice/Error'

const View = ({ id, apiUrl, docEditorConfig }) => {
  const [isError, setIsError] = useState(false)

  const initEditor = useCallback(
    () => {
      new window.DocsAPI.DocEditor('onlyOfficeEditor', docEditorConfig)
    },
    [docEditorConfig]
  )

  const handleError = useCallback(
    () => {
      const scriptNode = document.getElementById(id)
      scriptNode && scriptNode.remove()
      setIsError(true)
    },
    [setIsError, id]
  )

  useEffect(
    () => {
      const scriptAlreadyLoaded = document.getElementById(id)
      if (scriptAlreadyLoaded) return initEditor()

      const script = document.createElement('script')
      script.id = id
      script.src = apiUrl
      script.async = true
      script.onload = () => initEditor()
      script.onerror = () => handleError()

      document.body.appendChild(script)
    },
    [id, apiUrl, initEditor, handleError]
  )

  return isError ? <Error /> : <div id="onlyOfficeEditor" />
}

View.propTypes = {
  id: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  docEditorConfig: PropTypes.object.isRequired
}

export default React.memo(View)
