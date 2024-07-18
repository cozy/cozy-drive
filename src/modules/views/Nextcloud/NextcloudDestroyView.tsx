import React, { FC } from 'react'
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { useClient } from 'cozy-client'
import { UseQueryReturnValue } from 'cozy-client/types/types'

import { LoaderModal } from 'components/LoaderModal'
import { getParentPath } from 'lib/path'
import { hasDataLoaded } from 'lib/queries'
import { computeNextcloudFolderQueryId } from 'modules/nextcloud/helpers'
import { useNextcloudFolder } from 'modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudPath } from 'modules/nextcloud/hooks/useNextcloudPath'
import DestroyConfirm from 'modules/trash/components/DestroyConfirm'

const NextcloudDestroyView: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { sourceAccount } = useParams()
  const client = useClient()
  const path = useNextcloudPath({
    insideTrash: true
  })
  const { state, pathname } = useLocation() as {
    state: { fileIds?: string[] }
    pathname: string
  }

  const { nextcloudResult } = useNextcloudFolder({
    sourceAccount,
    path,
    insideTrash: true
  })

  const newPath = `${getParentPath(pathname) ?? ''}?${searchParams.toString()}`

  const handleClose = (): void => {
    navigate(newPath, { replace: true })
  }

  if (!state.fileIds) {
    return <Navigate to={newPath} replace />
  }

  if (
    hasDataLoaded(nextcloudResult as UseQueryReturnValue) &&
    nextcloudResult.data
  ) {
    const entries = nextcloudResult.data.filter(({ _id }) =>
      state.fileIds?.includes(_id)
    )

    const handleConfirm = async (): Promise<void> => {
      for (const file of entries) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await client
          ?.collection('io.cozy.remote.nextcloud.files')
          .deletePermanently(file)
      }
      const queryId =
        computeNextcloudFolderQueryId({
          sourceAccount,
          path
        }) + '/trashed'
      void client?.resetQuery(queryId)
    }

    return (
      <DestroyConfirm
        onConfirm={handleConfirm}
        files={entries}
        onClose={handleClose}
      />
    )
  }

  return <LoaderModal />
}

export { NextcloudDestroyView }
