import React, { FC } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { hasQueryBeenLoaded, useQuery } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import { LoaderModal } from 'components/LoaderModal'
import useDisplayedFolder from 'hooks/useDisplayedFolder'
import { DuplicateModal } from 'modules/duplicate/components/DuplicateModal'
import { buildParentsByIdsQuery } from 'queries'

const FolderDuplicateView: FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation() as {
    state: { fileIds?: string[] }
  }
  const { displayedFolder } = useDisplayedFolder()

  const hasFileIds = state.fileIds != undefined

  const fileQuery = buildParentsByIdsQuery(state.fileIds ?? [])
  const fileResult = useQuery(fileQuery.definition, {
    ...fileQuery.options,
    enabled: hasFileIds
  }) as {
    data?: IOCozyFile[] | null
  }

  if (!hasFileIds) {
    return <Navigate to=".." replace={true} />
  }

  if (hasQueryBeenLoaded(fileResult) && fileResult.data && displayedFolder) {
    const onClose = (): void => {
      navigate('..', { replace: true })
    }

    return (
      <DuplicateModal
        currentFolder={displayedFolder}
        entries={fileResult.data}
        onClose={onClose}
      />
    )
  }

  return <LoaderModal />
}

export { FolderDuplicateView }
