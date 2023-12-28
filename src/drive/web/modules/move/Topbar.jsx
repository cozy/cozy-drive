import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useQuery } from 'cozy-client'

import Topbar from 'drive/web/modules/layout/Topbar'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb/Breadcrumb'
import BackButton from 'components/Button/BackButton'
import { getBreadcrumbPath } from 'drive/web/modules/move/helpers'
import { buildOnlyFolderQuery } from 'drive/web/modules/queries'

const MoveTopbar = ({ navigateTo, folderId }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const folderQuery = buildOnlyFolderQuery(folderId)
  const { fetchStatus, data } = useQuery(
    folderQuery.definition,
    folderQuery.options
  )

  const path = fetchStatus === 'loaded' ? getBreadcrumbPath(t, data) : []
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
  folderId: PropTypes.string.isRequired
}

export default MoveTopbar
