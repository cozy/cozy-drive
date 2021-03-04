import React from 'react'
import PropTypes from 'prop-types'

import { isMobileApp } from 'cozy-device-helper'

import Sharing from './Sharing'
import ForwardButton from './ForwardButton'
import DownloadButton from './DownloadButton'

const FooterContent = ({ file }) => {
  const FileActionButton = isMobileApp() ? ForwardButton : DownloadButton

  return (
    <>
      <Sharing file={file} />
      <FileActionButton file={file} />
    </>
  )
}

FooterContent.propTypes = {
  file: PropTypes.object.isRequired
}

export default FooterContent
