import React from 'react'
import { useParams } from 'react-router-dom'

import { Query, Q } from 'cozy-client'

import HistoryModal from './HistoryModal'

const FileHistory = () => {
  const { fileId } = useParams()
  return (
    <Query query={() => Q('io.cozy.files').getById(fileId)}>
      {({ data: file, fetchStatus: fileFetchStatus }) => {
        return (
          <Query
            query={client =>
              client
                .all('io.cozy.files.versions')
                .where({
                  relationships: { file: { data: { _id: fileId } } },
                  updated_at: { $gt: null }
                })
                .sortBy([
                  { 'relationships.file.data._id': 'desc' },
                  { updated_at: 'desc' }
                ])
                .indexFields(['relationships.file.data._id', 'updated_at'])
            }
          >
            {({ data: revisions, fetchStatus: revisionsFetchStatus }) => {
              if (fileFetchStatus === 'loaded') {
                return (
                  <HistoryModal
                    revisions={revisions}
                    file={file}
                    revisionsFetchStatus={revisionsFetchStatus}
                    fileFetchStatus={fileFetchStatus}
                  />
                )
              }
              return null
            }}
          </Query>
        )
      }}
    </Query>
  )
}

export default FileHistory
