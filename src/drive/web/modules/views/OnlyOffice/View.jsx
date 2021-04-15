import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

const View = ({ id, apiUrl, config }) => {
  const initEditor = useCallback(
    () => {
      new window.DocsAPI.DocEditor('onlyOfficeEditor', config)
    },
    [config]
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

      document.body.appendChild(script)
    },
    [id, apiUrl, initEditor]
  )

  return <div id="onlyOfficeEditor" />
}

View.propTypes = {
  id: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired
}

export default View
