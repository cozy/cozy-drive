import PropTypes from 'prop-types'
import React, { useCallback } from 'react'

import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/breadcrumb/components/MobileAwareBreadcrumb'
import { useBreadcrumbPath } from 'modules/breadcrumb/hooks/useBreadcrumbPath.jsx'

const FolderViewBreadcrumb = ({
  currentFolderId,
  navigateToFolder,
  rootBreadcrumbPath,
  sharedDocumentIds
}) => {
  const path = useBreadcrumbPath({
    currentFolderId,
    rootBreadcrumbPath,
    sharedDocumentIds
  })

  const onBreadcrumbClick = useCallback(
    ({ id }) => navigateToFolder({ _id: id }),
    [navigateToFolder]
  )

  return path && path.length > 0 ? (
    <Breadcrumb
      path={path}
      onBreadcrumbClick={onBreadcrumbClick}
      opening={false}
    />
  ) : null
}

FolderViewBreadcrumb.propTypes = {
  currentFolderId: PropTypes.string.isRequired,
  navigateToFolder: PropTypes.func.isRequired,
  rootBreadcrumbPath: PropTypes.exact({
    id: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  sharedDocumentIds: PropTypes.array
}

export default FolderViewBreadcrumb
