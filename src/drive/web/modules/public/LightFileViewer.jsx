import React from 'react'
import PropTypes from 'prop-types'

import Viewer from 'drive/web/modules/viewer/PublicViewer'
import SharingBanner from 'drive/web/modules/public/SharingBanner'

import styles from 'drive/web/modules/viewer/barviewer.styl'

const LightFileViewer = ({ files }) => (
  <div className={styles['viewer-wrapper-with-bar']}>
    <SharingBanner />
    <div className={'u-pos-relative u-h-100'}>
      <Viewer
        files={files}
        currentIndex={0}
        toolbarProps={{ showToolbar: false }}
      />
    </div>
  </div>
)

LightFileViewer.propTypes = {
  files: PropTypes.array.isRequired,
  isFile: PropTypes.bool.isRequired
}
export default LightFileViewer
