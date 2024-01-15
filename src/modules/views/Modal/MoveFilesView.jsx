import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { hasQueryBeenLoaded, useQuery } from 'cozy-client'

import { LoaderModal } from 'components/LoaderModal'
import MoveModal from 'modules/move/MoveModal'
import { buildParentsByIdsQuery } from 'modules/queries'

const MoveFilesView = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const hasFileIds = state?.fileIds != undefined

  const fileQuery = buildParentsByIdsQuery(hasFileIds ? state.fileIds : [])
  const fileResult = useQuery(fileQuery.definition, {
    ...fileQuery.options,
    enabled: hasFileIds
  })

  if (!hasFileIds) {
    return <Navigate to=".." replace={true} />
  }

  if (hasQueryBeenLoaded(fileResult) && fileResult.data) {
    const onClose = () => {
      navigate('..', { replace: true })
    }

    return <MoveModal entries={fileResult.data} onClose={onClose} />
  }

  return <LoaderModal />
}

export { MoveFilesView }
