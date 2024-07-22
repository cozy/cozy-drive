import React from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { LoaderModal } from 'components/LoaderModal'
import { getParentPath } from 'lib/path'
import MoveModal from 'modules/move/MoveModal'
import { useNextcloudCurrentFolder } from 'modules/nextcloud/hooks/useNextcloudCurrentFolder'
import { useNextcloudEntries } from 'modules/nextcloud/hooks/useNextcloudEntries'

const NextcloudMoveView = () => {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentFolder = useNextcloudCurrentFolder()
  const { entries, hasEntries, isLoading } = useNextcloudEntries()

  const newPath = getParentPath(pathname) + `?${searchParams.toString()}`

  const onClose = () => {
    navigate(newPath, { replace: true })
  }

  if (!hasEntries) {
    return <Navigate to={newPath} replace />
  }

  if (entries && !isLoading && currentFolder) {
    return (
      <MoveModal
        showNextcloudFolder
        currentFolder={currentFolder}
        entries={entries}
        onClose={onClose}
      />
    )
  }

  return <LoaderModal />
}

export { NextcloudMoveView }
