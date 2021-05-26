import React, { useEffect, useCallback, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Spinner from 'cozy-ui/transpiled/react/Spinner'

import Error from 'drive/web/modules/views/OnlyOffice/Error'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'

const forceIframesHeight = value => {
  const iframes = document.getElementsByTagName('iframe')

  for (const iframe of iframes) {
    iframe.style.height = value
  }
}

const View = ({ id, apiUrl, docEditorConfig }) => {
  const [isError, setIsError] = useState(false)
  const { isEditorReady } = useContext(OnlyOfficeContext)

  const initEditor = useCallback(
    () => {
      new window.DocsAPI.DocEditor('onlyOfficeEditor', docEditorConfig)
      forceIframesHeight('0')
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

  useEffect(
    () => {
      isEditorReady && forceIframesHeight('100%')
    },
    [isEditorReady]
  )

  if (isError) return <Error />

  return (
    <>
      {!isEditorReady && (
        <Spinner
          className={cx(
            'u-flex u-flex-items-center u-flex-justify-center u-flex-grow-1'
          )}
          size="xxlarge"
        />
      )}
      <div id="onlyOfficeEditor" />
    </>
  )
}

View.propTypes = {
  id: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  docEditorConfig: PropTypes.object.isRequired
}

export default React.memo(View)
