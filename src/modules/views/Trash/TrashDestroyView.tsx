import React, { FC } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'

import { useQuery, hasQueryBeenLoaded, useClient } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import { useSharingContext } from 'cozy-sharing'

import { LoaderModal } from '@/components/LoaderModal'
import DestroyConfirm from '@/modules/trash/components/DestroyConfirm'
import { buildParentsByIdsQuery } from '@/queries'

const TrashDestroyView: FC = () => {
  const { refresh } = useSharingContext()
  const navigate = useNavigate()
  const client = useClient()
  const { state } = useLocation() as {
    state: { fileIds?: string[] }
  }

  const handleClose = (): void => {
    navigate('..', { replace: true })
  }

  const hasFileIds = state.fileIds !== undefined

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

  const handleConfirm = async (): Promise<void> => {
    if (!fileResult.data) return
    for (const file of fileResult.data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await client?.collection('io.cozy.files').deleteFilePermanently(file.id)
    }
    refresh()
  }

  const hasData = Array.isArray(fileResult.data)
    ? fileResult.data.length > 0
    : fileResult.data

  if (hasQueryBeenLoaded(fileResult) && hasData) {
    return (
      <DestroyConfirm
        files={fileResult.data}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    )
  }

  return <LoaderModal />
}

export { TrashDestroyView }
