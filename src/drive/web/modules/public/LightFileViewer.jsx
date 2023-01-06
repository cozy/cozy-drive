import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { useNavigate } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { SharingBannerPlugin, useSharingInfos } from 'cozy-sharing'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'

import PublicViewer from 'drive/web/modules/viewer/PublicViewer'
import PublicToolbar from 'drive/web/modules/public/PublicToolbar'
import {
  isOnlyOfficeEnabled,
  makeOnlyOfficeFileRoute
} from 'drive/web/modules/views/OnlyOffice/helpers'

import styles from 'drive/web/modules/viewer/barviewer.styl'

const LightFileViewer = ({ files }) => {
  const sharingInfos = useSharingInfos()
  const { isDesktop, isMobile } = useBreakpoints()

  const navigate = useNavigate()

  const onlyOfficeOpener = useCallback(
    file => navigate(makeOnlyOfficeFileRoute(file, true)),
    [navigate]
  )

  return (
    <div className={styles['viewer-wrapper-with-bar']}>
      <SharingBannerPlugin />
      {!isDesktop && (
        <PublicToolbar
          className={cx({ 'u-mt-1 u-mr-1': !isMobile })}
          files={files}
          sharingInfos={sharingInfos}
        />
      )}
      <div className={'u-pos-relative u-h-100'}>
        <PublicViewer
          files={files}
          currentIndex={0}
          onlyOfficeProps={{
            isEnabled: isOnlyOfficeEnabled(),
            opener: onlyOfficeOpener
          }}
          toolbarProps={{ showToolbar: isDesktop }}
        >
          <FooterActionButtons>
            <ForwardOrDownloadButton />
          </FooterActionButtons>
        </PublicViewer>
      </div>
    </div>
  )
}

LightFileViewer.propTypes = {
  files: PropTypes.array.isRequired
}

export default LightFileViewer
