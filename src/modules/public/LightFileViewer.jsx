import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { BarCenter } from 'cozy-bar'
import { SharingBannerPlugin, useSharingInfos } from 'cozy-sharing'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import Typography from 'cozy-ui/transpiled/react/Typography'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import PublicToolbar from 'modules/public/PublicToolbar'
import PublicViewer from 'modules/viewer/PublicViewer'
import {
  isOfficeEnabled,
  makeOnlyOfficeFileRoute
} from 'modules/views/OnlyOffice/helpers'

import styles from 'modules/viewer/barviewer.styl'

const LightFileViewer = ({ files, isPublic }) => {
  const sharingInfos = useSharingInfos()
  const { isDesktop, isMobile } = useBreakpoints()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const onlyOfficeOpener = useCallback(
    file => {
      const route = makeOnlyOfficeFileRoute(file.id, {
        fromPathname: pathname
      })
      navigate(route)
    },
    [navigate, pathname]
  )

  return (
    <div className={styles['viewer-wrapper-with-bar']}>
      {isMobile && (
        <BarCenter>
          <Typography variant="h3" noWrap className="u-ph-1 u-pt-half">
            <MidEllipsis text={files[0].name} />
          </Typography>
        </BarCenter>
      )}
      <SharingBannerPlugin />
      {!isDesktop && (
        <PublicToolbar
          className={cx({ 'u-mt-1 u-mr-1': !isMobile })}
          files={files}
          sharingInfos={sharingInfos}
        />
      )}
      <div className="u-pos-relative u-h-100">
        <PublicViewer
          files={files}
          isPublic={isPublic}
          currentIndex={0}
          disableModal
          componentsProps={{
            OnlyOfficeViewer: {
              isEnabled: isOfficeEnabled(isDesktop),
              opener: onlyOfficeOpener
            },
            toolbarProps: { showToolbar: isDesktop, showClose: false }
          }}
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
  files: PropTypes.array.isRequired,
  isPublic: PropTypes.bool
}

export default LightFileViewer
