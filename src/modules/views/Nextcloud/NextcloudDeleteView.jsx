import React from 'react'
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { LoaderModal } from 'components/LoaderModal'
import { getParentPath } from 'lib/path'
import { hasDataLoaded } from 'lib/queries'
import { NextcloudDeleteConfirm } from 'modules/nextcloud/components/NextcloudDeleteConfirm'
import { useNextcloudFolder } from 'modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudPath } from 'modules/nextcloud/hooks/useNextcloudPath'

const NextcloudDeleteView = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { sourceAccount } = useParams()
  const path = useNextcloudPath()
  const { state, pathname } = useLocation()

  const { nextcloudResult } = useNextcloudFolder({
    sourceAccount,
    path
  })

  const newPath = getParentPath(pathname) + `?${searchParams.toString()}`

  const handleClose = () => {
    navigate(newPath, { replace: true })
  }

  if (!state?.fileIds) {
    return <Navigate to={newPath} replace />
  }

  if (hasDataLoaded(nextcloudResult)) {
    const entries = nextcloudResult.data.filter(({ _id }) =>
      state.fileIds.includes(_id)
    )
    return <NextcloudDeleteConfirm files={entries} onClose={handleClose} />
  }

  return <LoaderModal />
}

export { NextcloudDeleteView }
