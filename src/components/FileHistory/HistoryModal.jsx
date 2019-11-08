import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'cozy-ui/transpiled/react/Modal'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { translate } from 'cozy-ui/react/I18n'

import { withClient } from 'cozy-client'
import { withRouter } from 'react-router'

import HistoryRow from './HistoryRow'
import { CozyFile } from 'models'

const formatDate = (date, f) => {
  return f(date, 'DD MMMM - HH[h]mm')
}

const HistoryModal = ({
  file,
  router,
  revisions,
  client,
  f,
  revisionsFetchStatus
}) => {
  const fileCollection = client.collection('io.cozy.files')
  return (
    <Modal
      dismissAction={() => router.goBack()}
      overflowHidden={true}
      title={file.name}
      description={
        <>
          <HistoryRow
            image="file"
            tag="Version actuelle"
            primaryText={formatDate(file.updated_at, f)}
            secondaryText={`${fileCollection.getBeautifulSize(file)} · ${
              file.name
            }`}
            downloadLink={() => fileCollection.download(file)}
          />
          {revisionsFetchStatus === 'loading' && <Spinner size="xxlarge" />}
          {revisionsFetchStatus === 'loaded' &&
            revisions.map((revision, index) => {
              return (
                <HistoryRow
                  image="file"
                  // tag="Version actuelle"
                  primaryText={formatDate(revision.updated_at, f)}
                  secondaryText={`${fileCollection.getBeautifulSize(
                    revision
                  )} · ${file.name}`}
                  key={index}
                  downloadLink={() =>
                    fileCollection.download(
                      file,
                      revision._id,
                      CozyFile.generateFileNameForRevision(file, revision, f)
                    )
                  }
                />
              )
            })}
        </>
      }
    />
  )
}
HistoryModal.propTypes = {
  file: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  revisions: PropTypes.array,
  client: PropTypes.object.isRequired,
  f: PropTypes.func.isRequired,
  revisionsFetchStatus: PropTypes.string.isRequired
}
export default translate()(withRouter(withClient(HistoryModal)))
