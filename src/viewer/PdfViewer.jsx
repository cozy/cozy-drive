import React from 'react'
import NoViewer from './NoViewer'

import withFileUrl from './withFileUrl'
import styles from './styles'

const PdfViewer = ({ file, t, url }) => (
  <div className={styles['pho-viewer-pdfviewer']}>
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
