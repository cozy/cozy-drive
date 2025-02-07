import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'

import { EmptyTrashConfirm } from '@/modules/trash/components/EmptyTrashConfirm'

const TrashEmptyView: FC = () => {
  const navigate = useNavigate()
  const client = useClient()

  const handleClose = (): void => {
    navigate('..', { replace: true })
  }

  const onConfirm = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await client?.collection('io.cozy.files').emptyTrash()
  }

  return <EmptyTrashConfirm onConfirm={onConfirm} onClose={handleClose} />
}

export { TrashEmptyView }
