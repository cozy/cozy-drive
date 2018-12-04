import React from 'react'
import NoViewer from './NoViewer'
import cx from 'classnames'
import withFileUrl from './withFileUrl'
import styles from './styles'
import { isIOS } from 'cozy-device-helper'

const PdfViewer = ({ file, url }) => (
  <div
    className={cx(styles['pho-viewer-pdfviewer'], {
      [styles['pho-viewer-pdfviewer-ios']]: isIOS()
    })}
  >
    <object
      data={url}
      type="application/pdf"
      className="vui-fileviewer-pdf-native"
    >
      <NoViewer file={file} fallbackUrl={url} />
    </object>
  </div>
)

export default withFileUrl(PdfViewer)
