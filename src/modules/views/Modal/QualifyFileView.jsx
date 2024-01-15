import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { hasQueryBeenLoaded, useQuery } from 'cozy-client'
import { EditDocumentQualification } from 'cozy-scanner'

import { LoaderModal } from 'components/LoaderModal'
import { buildFileByIdQuery } from 'modules/queries'

const QualifyFileView = () => {
  const navigate = useNavigate()
  const { fileId } = useParams()

  const fileQuery = buildFileByIdQuery(fileId)
  const fileResult = useQuery(fileQuery.definition, fileQuery.options)

  if (hasQueryBeenLoaded(fileResult) && fileResult.data) {
    const onClose = () => {
      navigate('..', { replace: true })
    }

    return (
      <EditDocumentQualification
        document={fileResult.data}
        onQualified={() => {
          onClose()
          // changes should be retrieved through cozy-client
        }}
        onClose={onClose}
      />
    )
  }

  return <LoaderModal />
}

export { QualifyFileView }
