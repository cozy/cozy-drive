import React from 'react'
import PropTypes from 'prop-types'

import ExperimentalModal from 'cozy-ui/transpiled/react/Labs/ExperimentalModal'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { translate } from 'cozy-ui/react/I18n'
import { Caption } from 'cozy-ui/transpiled/react/Text'

import { withClient } from 'cozy-client'
import { withRouter } from 'react-router'

import HistoryRow from './HistoryRow'
import styles from './styles.styl'

import { CozyFile } from 'models'
import { isMobile } from 'cozy-device-helper/dist/platform'
import { exportFilesNative } from 'drive/web/modules/navigation/duck/actions'
const formatDate = (date, f) => {
  return f(date, 'DD MMMM - HH[h]mm')
}

const HistoryModal = ({
  file,
  router,
  revisions,
  client,
  f,
  t,
  revisionsFetchStatus
}) => {
  const fileCollection = client.collection('io.cozy.files')
  return (
    <ExperimentalModal
      dismissAction={() => router.goBack()}
      overflowHidden={true}
      title={file.name}
      description={
        <>
          <Caption className={styles.HistoryRowCaption}>
            {t('History.description')}
          </Caption>
          <HistoryRow
            image="file"
            tag={t('History.current_version')}
            primaryText={formatDate(file.updated_at, f)}
            secondaryText={fileCollection.getBeautifulSize(file)}
            downloadLink={async () => {
              if (!isMobile()) {
                fileCollection.download(file)
              } else {
                exportFilesNative([file._id])()
              }
            }}
          />
          {revisionsFetchStatus === 'loading' && (
            <div className={styles.HistoryRowRevisionLoader}>
              <Spinner size="xxlarge" />
            </div>
          )}
          {revisionsFetchStatus === 'loaded' &&
            revisions.map((revision, index) => {
              return (
                <HistoryRow
                  image="file"
                  // tag="Version actuelle"
                  primaryText={formatDate(revision.updated_at, f)}
                  secondaryText={fileCollection.getBeautifulSize(revision)}
                  key={index}
                  downloadLink={async () => {
                    if (!isMobile()) {
                      fileCollection.download(
                        file,
                        revision._id,
                        CozyFile.generateFileNameForRevision(file, revision, f)
                      )
                    } else {
                      exportFilesNative(
                        [revision._id],
                        client,
                        CozyFile.generateFileNameForRevision(file, revision, f)
                      )()
                    }
                  }}
                />
              )
            })}
        </>
      }
    />
  )
}
withClient(HistoryModal).prototype = React.Component.prototype
HistoryModal.propTypes = {
  file: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  revisions: PropTypes.array,
  client: PropTypes.object.isRequired,
  f: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  revisionsFetchStatus: PropTypes.string.isRequired
}
export default translate()(withRouter(withClient(HistoryModal)))
