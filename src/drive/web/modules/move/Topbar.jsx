import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Topbar from 'drive/web/modules/layout/Topbar'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import {
  Breadcrumb,
  PreviousButton,
  renamePathNames
} from 'drive/web/modules/navigation/Breadcrumb'
import getFolderPath from 'drive/web/modules/navigation/Breadcrumb/getFolderPath'

const buildBreadcrumbPath = (currentDir, t) =>
  renamePathNames(
    getFolderPath({
      ...currentDir,
      parent: get(currentDir, 'relationships.parent.data')
    }),
    '',
    t
  )

const MoveTopbar = (
  { navigateTo, currentDir, fetchStatus, breakpoints: { isMobile } },
  { t }
) => {
  const path =
    fetchStatus === 'loaded' ? buildBreadcrumbPath(currentDir, t) : []
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
