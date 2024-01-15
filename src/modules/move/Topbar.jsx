import PropTypes from 'prop-types'
import React from 'react'

import { useQuery } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import FolderAddIcon from 'cozy-ui/transpiled/react/Icons/FolderAdd'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import BackButton from 'components/Button/BackButton'
import Topbar from 'modules/layout/Topbar'
import { getBreadcrumbPath } from 'modules/move/helpers'
import Breadcrumb from 'modules/navigation/Breadcrumb/Breadcrumb'
import { buildOnlyFolderQuery } from 'modules/queries'

const MoveTopbar = ({ navigateTo, folderId, showFolderCreation }) => {
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
      <IconButton onClick={showFolderCreation} aria-label={t('Move.addFolder')}>
        <Icon icon={FolderAddIcon} />
      </IconButton>
    </Topbar>
  )
}

MoveTopbar.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  folderId: PropTypes.string.isRequired
}

export default MoveTopbar
