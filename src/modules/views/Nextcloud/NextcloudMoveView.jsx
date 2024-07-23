import React, { useMemo } from 'react'
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { computeNextcloudRootFolder } from 'components/FolderPicker/helpers'
import { LoaderModal } from 'components/LoaderModal'
import { getParentPath } from 'lib/path'
import { hasDataLoaded } from 'lib/queries'
import MoveModal from 'modules/move/MoveModal'
import { useNextcloudEntries } from 'modules/nextcloud/hooks/useNextcloudEntries'
import { useNextcloudFolder } from 'modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudInfos } from 'modules/nextcloud/hooks/useNextcloudInfos'
import { useNextcloudPath } from 'modules/nextcloud/hooks/useNextcloudPath'

const NextcloudMoveView = () => {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { sourceAccount } = useParams()
  const path = useNextcloudPath()
  const navigate = useNavigate()

  const { entries, hasEntries, isLoading } = useNextcloudEntries()

  const { instanceName } = useNextcloudInfos({ sourceAccount })
  const { nextcloudResult: nextcloudParentResult } = useNextcloudFolder({
    sourceAccount,
    path: getParentPath(path)
  })

  /**
   * Nextcloud don't have route to get parent folder
   * so we need to fetch the content of his parent folder to get current folder data
   */
  const currentFolder = useMemo(() => {
    if (path === '/') {
      return computeNextcloudRootFolder({
        sourceAccount,
        instanceName
      })
    }

    if (hasDataLoaded(nextcloudParentResult)) {
      return (nextcloudParentResult?.data ?? []).find(
        file => file.path === path
      )
    }

    return undefined
  }, [path, nextcloudParentResult, sourceAccount, instanceName])

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
