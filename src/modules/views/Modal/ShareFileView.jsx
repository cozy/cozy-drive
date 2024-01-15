import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { hasQueryBeenLoaded, useQuery } from 'cozy-client'
import { ShareModal } from 'cozy-sharing'

import { LoaderModal } from 'components/LoaderModal'
import { buildFileByIdQuery } from 'modules/queries'

const ShareFileView = () => {
  const navigate = useNavigate()
  const { fileId } = useParams()

  const fileQuery = buildFileByIdQuery(fileId)
  const fileResult = useQuery(fileQuery.definition, fileQuery.options)

  if (hasQueryBeenLoaded(fileResult) && fileResult.data) {
    const onClose = () => {
      navigate('..', { replace: true })
    }

    return (
      <ShareModal
        document={fileResult.data}
        documentType="Files"
        sharingDesc={fileResult.data.name}
        onClose={onClose}
      />
    )
  }

  return <LoaderModal />
}

export { ShareFileView }
