import React from 'react'
import PropTypes from 'prop-types'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import Viewer from 'drive/web/modules/viewer/PublicViewer'
import SharingBanner from 'drive/web/modules/public/SharingBanner'
import { useSharingInfos } from 'drive/web/modules/public/useSharingInfos'
import PublicToolbar from 'drive/web/modules/public/PublicToolbar'

import styles from 'drive/web/modules/viewer/barviewer.styl'

const LightFileViewer = ({ files }) => {
  const sharingInfos = useSharingInfos()
  const { isDesktop } = useBreakpoints()

  return (
    <div className={styles['viewer-wrapper-with-bar']}>
      <SharingBanner sharingInfos={sharingInfos} />
      {!isDesktop && (
        <div className="u-mt-1 u-mr-1">
          <PublicToolbar files={files} sharingInfos={sharingInfos} />
        </div>
      )}
      <div className={'u-pos-relative u-h-100'}>
        <Viewer
          files={files}
          currentIndex={0}
          toolbarProps={{ showToolbar: isDesktop }}
        />
      </div>
    </div>
  )
}

LightFileViewer.propTypes = {
  files: PropTypes.array.isRequired
}

export default LightFileViewer
