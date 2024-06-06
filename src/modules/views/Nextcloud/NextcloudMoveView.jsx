import React from 'react'
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { hasQueryBeenLoaded } from 'cozy-client'

import { LoaderModal } from 'components/LoaderModal'
import { getParentPath } from 'lib/path'
import { CozyFile } from 'models/index'
import MoveModal from 'modules/move/MoveModal'
import { useNextcloudFolder } from 'modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudPath } from 'modules/nextcloud/hooks/useNextcloudPath'

const NextcloudMoveView = () => {
  const { state, pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { shortcutId } = useParams()
  const path = useNextcloudPath()
  const navigate = useNavigate()

  const { nextcloudResult, shortcutResult } = useNextcloudFolder({
    shortcutId,
    path
  })

  const { nextcloudResult: nextcloudParentResult } = useNextcloudFolder({
    shortcutId,
    path: getParentPath(path)
  })

  const hasFileIds = state?.fileIds != undefined
  if (!hasFileIds) {
    const newPath = getParentPath(pathname) + `?${searchParams.toString()}`
    return <Navigate to={newPath} replace />
  }

  if (
    hasQueryBeenLoaded(nextcloudResult) &&
    nextcloudResult.data &&
    (path === '/' ||
      (hasQueryBeenLoaded(nextcloudParentResult) && nextcloudParentResult.data))
  ) {
    const onClose = () => {
      const newPath = getParentPath(pathname) + `?${searchParams.toString()}`
      navigate(newPath, { replace: true })
    }

    const entries = nextcloudResult.data.filter(({ _id }) =>
      state.fileIds.includes(_id)
    )

    var currentFolder = {
      _id: 'io.cozy.remote.nextcloud.files.root-dir',
      _type: 'io.cozy.remote.nextcloud.files',
      name: CozyFile.splitFilename(shortcutResult.data).filename,
      path: '/',
      cozyMetadata: {
        sourceAccount: shortcutResult.data.cozyMetadata.sourceAccount
      }
    }
    if (path !== '/') {
      currentFolder = (nextcloudParentResult?.data ?? []).find(
        file => file.path === path
      )
    }

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
