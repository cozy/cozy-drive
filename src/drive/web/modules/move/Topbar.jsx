import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import Topbar from 'drive/web/modules/layout/Topbar'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb/Breadcrumb'
import BackButton from 'components/Button/BackButton'
import { ROOT_DIR_ID } from 'drive/constants/config'

const getBreadcrumbPath = (t, displayedFolder) =>
  uniqBy(
    [
      {
        _id: ROOT_DIR_ID
      },
      {
        _id: get(displayedFolder, 'dir_id')
      },
      {
        _id: displayedFolder._id,
        name: displayedFolder.name
      }
    ],
    '_id'
  )
    .filter(({ _id }) => Boolean(_id))
    .map(breadcrumb => ({
      _id: breadcrumb._id,
      name:
        breadcrumb.name ||
        (breadcrumb._id === ROOT_DIR_ID ? t('breadcrumb.title_drive') : '…')
    }))

const MoveTopbar = (
  { navigateTo, currentDir, fetchStatus, breakpoints: { isMobile } },
  { t }
) => {
  const path = fetchStatus === 'loaded' ? getBreadcrumbPath(t, currentDir) : []
  const showPreviousButton = path.length > 1 && isMobile
  return (
    <Topbar hideOnMobile={false}>
      {showPreviousButton && (
        <BackButton onClick={() => navigateTo(path[path.length - 2])} t={t} />
      )}
      <Breadcrumb
        path={path}
        onBreadcrumbClick={navigateTo}
        opening={false}
        inlined
      />
    </Topbar>
  )
}

MoveTopbar.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  currentDir: PropTypes.object,
  fetchStatus: PropTypes.string.isRequired,
  breakpoints: PropTypes.shape({
    isMobile: PropTypes.bool
  }).isRequired
}
MoveTopbar.contextTypes = {
  t: PropTypes.func.isRequired
}
export default withBreakpoints()(MoveTopbar)
