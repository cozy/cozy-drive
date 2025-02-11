import React, { FC } from 'react'
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams
} from 'react-router-dom'

import { useClient } from 'cozy-client'

import { getParentPath } from '@/lib/path'
import { computeNextcloudFolderQueryId } from '@/modules/nextcloud/helpers'
import { useNextcloudPath } from '@/modules/nextcloud/hooks/useNextcloudPath'
import { EmptyTrashConfirm } from '@/modules/trash/components/EmptyTrashConfirm'

const NextcloudTrashEmptyView: FC = () => {
  const { sourceAccount } = useParams()
  const [searchParams] = useSearchParams()
  const { pathname } = useLocation()
  const path = useNextcloudPath({
    insideTrash: true
  })
  const navigate = useNavigate()
  const client = useClient()

  const handleClose = (): void => {
    navigate(`${getParentPath(pathname) ?? ''}?${searchParams.toString()}`, {
      replace: true
    })
  }

  const handleConfirm = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await client
      ?.collection('io.cozy.remote.nextcloud.files')
      .emptyTrash(sourceAccount)
    const queryId =
      computeNextcloudFolderQueryId({
        sourceAccount,
        path
      }) + '/trashed'
    await client?.resetQuery(queryId)
  }

  return <EmptyTrashConfirm onConfirm={handleConfirm} onClose={handleClose} />
}

export { NextcloudTrashEmptyView }
