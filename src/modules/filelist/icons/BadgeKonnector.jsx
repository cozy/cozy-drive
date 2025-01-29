import PropTypes from 'prop-types'
import React from 'react'

import {
  getReferencedBy,
  isQueryLoading,
  isReferencedBy,
  useQuery
} from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Badge from 'cozy-ui/transpiled/react/Badge'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { DOCTYPE_KONNECTORS } from 'lib/doctypes'
import { buildFileByIdQuery } from 'queries'

const getKonnectorSlugFromFile = file => {
  const konnector = getReferencedBy(file, DOCTYPE_KONNECTORS)[0]
  if (konnector) {
    return konnector.id.split('/')[1]
  }
  return null
}

const useStyle = makeStyles({
  badge: {
    backgroundColor: 'var(--white)',
    height: '1.5rem',
    minWidth: '1.5rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--borderMainColor)'
  },
  appIcon: {
    width: '75%',
    height: '75%'
  },
  anchorOriginBottomRightCircular: {
    bottom: '10px'
  }
})

export const BadgeKonnector = ({ file, children }) => {
  const { badge, anchorOriginBottomRightCircular, appIcon } = useStyle()
  const konnectorSlug = getKonnectorSlugFromFile(file)

  // Check if the parent folder is a konnector folder, because if have no file in your account folder, its considered as a konnector folder
  const parentFolderQuery = buildFileByIdQuery(file.dir_id)
  const { data: parentFolder, ...parentQueryQueryLeft } = useQuery(
    parentFolderQuery.definition,
    parentFolderQuery.options
  )
  const isparentQueryLoading = isQueryLoading(parentQueryQueryLeft)
  const hasKonnectorParentFolder = isReferencedBy(
    parentFolder,
    DOCTYPE_KONNECTORS
  )

  if (isparentQueryLoading || hasKonnectorParentFolder) {
    return <>{children}</>
  }

  return (
    <Badge
      classes={{ badge, anchorOriginBottomRightCircular }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <AppIcon
          className={appIcon}
          type="konnector"
          app={{ slug: konnectorSlug }}
        />
      }
    >
      {children}
    </Badge>
  )
}

BadgeKonnector.propTypes = {
  file: PropTypes.object.isRequired
}
