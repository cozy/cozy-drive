import React from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { LoaderModal } from '@/components/LoaderModal'
import { getParentPath } from '@/lib/path'
import { NextcloudDeleteConfirm } from '@/modules/nextcloud/components/NextcloudDeleteConfirm'
import { useNextcloudEntries } from '@/modules/nextcloud/hooks/useNextcloudEntries'

const NextcloudDeleteView = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { pathname } = useLocation()
  const { entries, hasEntries, isLoading } = useNextcloudEntries()

  const newPath = getParentPath(pathname) + `?${searchParams.toString()}`

  const handleClose = () => {
    navigate(newPath, { replace: true })
  }

  if (!hasEntries) {
    return <Navigate to={newPath} replace />
  }

  if (entries && !isLoading) {
    return <NextcloudDeleteConfirm files={entries} onClose={handleClose} />
  }

  return <LoaderModal />
}

export { NextcloudDeleteView }
