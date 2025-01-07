import React, { FC } from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { LoaderModal } from '@/components/LoaderModal'
import { getParentPath } from '@/lib/path'
import { DuplicateModal } from '@/modules/duplicate/components/DuplicateModal'
import { useNextcloudCurrentFolder } from '@/modules/nextcloud/hooks/useNextcloudCurrentFolder'
import { useNextcloudEntries } from '@/modules/nextcloud/hooks/useNextcloudEntries'

const NextcloudDuplicateView: FC = () => {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentFolder = useNextcloudCurrentFolder()
  const { entries, hasEntries, isLoading } = useNextcloudEntries()

  const newPath =
    (getParentPath(pathname) ?? '') + `?${searchParams.toString()}`

  if (!hasEntries && !isLoading) {
    return <Navigate to={newPath} replace />
  }

  if (entries && currentFolder) {
    const onClose = (): void => {
      navigate(newPath, { replace: true })
    }

    return (
      <DuplicateModal
        showNextcloudFolder
        currentFolder={currentFolder}
        entries={entries}
        onClose={onClose}
      />
    )
  }

  return <LoaderModal />
}

export { NextcloudDuplicateView }
