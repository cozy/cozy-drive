import PropTypes from 'prop-types'
import React from 'react'

import CallToAction from './CallToAction'
import NoViewerButton from './NoViewerButton'

const Fallback = ({ file, t }) => {
  return (
    <>
      <NoViewerButton file={file} t={t} />
      <CallToAction t={t} />
    </>
  )
}

Fallback.propTypes = {
  file: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired // t is a prop passed by the parent and must not be received from the translate() HOC — otherwise the translation context becomes the one of the viewer instad of the app. See https://github.com/cozy/cozy-ui/issues/914#issuecomment-487959521
}

export default Fallback
