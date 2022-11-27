import React from 'react'
import PropTypes from 'prop-types'

import { Query, Q } from 'cozy-client'

import HistoryModal from './HistoryModal'

const FileHistory = ({ params: { fileId } }) => {
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
FileHistory.propTypes = {
  params: PropTypes.shape({
    fileId: PropTypes.string.isRequired
  })
}
export default FileHistory
