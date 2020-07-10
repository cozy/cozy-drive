import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import Topbar from 'drive/web/modules/layout/Topbar'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb/Breadcrumb'
import PreviousButton from 'drive/web/modules/navigation/Breadcrumb/PreviousButton'
import { ROOT_DIR_ID } from 'drive/constants/config'

const getBreadcrumbPath = (t, displayedFolder) =>
  uniqBy(
    [
      {
        id: ROOT_DIR_ID
      },
      {
        id: get(displayedFolder, 'dir_id')
      },
      {
        id: displayedFolder.id,
        name: displayedFolder.name
      }
    ],
    'id'
  )
    .filter(({ id }) => Boolean(id))
    .map(breadcrumb => ({
      id: breadcrumb.id,
      name:
        breadcrumb.name ||
        (breadcrumb.id === ROOT_DIR_ID ? t('breadcrumb.title_drive') : '…')
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
        <PreviousButton onClick={() => navigateTo(path[path.length - 2])} />
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
  currentDir: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  breakpoints: PropTypes.shape({
    isMobile: PropTypes.bool
  }).isRequired
}
MoveTopbar.contextTypes = {
  t: PropTypes.func.isRequired
}
export default withBreakpoints()(MoveTopbar)
