import React from 'react'
import PropTypes from 'prop-types'

import CallToAction from './CallToAction'
import NoViewerButton from './NoViewerButton'

const Fallback = ({ file }) => {
  return (
    <>
      <NoViewerButton file={file} />
      <CallToAction />
    </>
  )
}

Fallback.propTypes = {
  file: PropTypes.object
}

export default Fallback
