import React from 'react'

import withFileUrl from './withFileUrl'
import styles from './styles'

const PdfViewer = ({ file, url }) => (
  <div className={styles['pho-viewer-pdfviewer']}>
    <object
      data={url}
      type="application/pdf"
      className="vui-fileviewer-pdf-native"
    />
  </div>
)

export default withFileUrl(PdfViewer)
