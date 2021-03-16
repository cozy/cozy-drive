import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import { isMobileApp } from 'cozy-device-helper'

import { showPanel } from '../helpers'
import Sharing from './Sharing'
import ForwardButton from './ForwardButton'
import DownloadButton from './DownloadButton'
import BottomSheet from './BottomSheet'
import BottomSheetContent from './BottomSheetContent'

const useStyles = makeStyles(theme => ({
  footer: {
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 2rem)',
    height: '100%',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    borderTop: `1px solid ${theme.palette.divider}`
  }
}))

const FooterContent = ({ file, toolbarRef }) => {
  const styles = useStyles()
  const FileActionButton = isMobileApp() ? ForwardButton : DownloadButton
  const actionButtonsRef = useRef()

  if (showPanel({ file }))
    return (
      <BottomSheet
        file={file}
        actionButtonsRef={actionButtonsRef}
        toolbarRef={toolbarRef}
      >
        <BottomSheetContent file={file} ref={actionButtonsRef} />
      </BottomSheet>
    )

  return (
    <div className={styles.footer}>
      <Sharing file={file} />
      <FileActionButton file={file} />
    </div>
  )
}

FooterContent.propTypes = {
  file: PropTypes.object.isRequired
}

export default FooterContent
