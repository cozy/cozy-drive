import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import DialogContent from '@material-ui/core/DialogContent'

import ExperimentalDialog, {
  ExperimentalDialogTitle
} from 'cozy-ui/transpiled/react/Labs/ExperimentalDialog'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Caption } from 'cozy-ui/transpiled/react/Text'

import { withClient, useCapabilities } from 'cozy-client'
import { withRouter } from 'react-router'

import HistoryRow from 'cozy-ui/transpiled/react/HistoryRow'
import styles from './styles.styl'

import { CozyFile } from 'models'
import { isMobile } from 'cozy-device-helper/dist/platform'
import { exportFilesNative } from 'drive/web/modules/actions/utils'

const formatDate = (date, f) => {
  return f(date, 'DD MMMM - HH:mm')
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
  const capabilities = useCapabilities(client)
  const isFileVersioningEnabled = get(
    capabilities,
    'capabilities.data.attributes.file_versioning'
  )
  return (
    <ExperimentalDialog onClose={router.goBack}>
      <DialogCloseButton onClick={router.goBack} />
      <ExperimentalDialogTitle>{file.name}</ExperimentalDialogTitle>
      <DialogContent>
        <>
          <Caption className={styles.HistoryRowCaption}>
            {capabilities.fetchStatus === 'loading' && (
              <span>{t('History.loading')}</span>
            )}
            {capabilities.fetchStatus === 'loaded' &&
              isFileVersioningEnabled && (
                <span>{t('History.description')}</span>
              )}
            {(capabilities.fetchStatus === 'failed' ||
              (!isFileVersioningEnabled &&
                capabilities.fetchStatus !== 'loading')) && (
              <span>{t('History.noFileVersionEnabled')}</span>
            )}
          </Caption>
          <HistoryRow
            tag={t('History.current_version')}
            primaryText={formatDate(file.updated_at, f)}
            secondaryText={fileCollection.getBeautifulSize(file)}
            downloadLink={() => {
              if (!isMobile()) {
                fileCollection.download(file)
              } else {
                exportFilesNative(client, [file], file.name)
              }
            }}
          />
          {revisionsFetchStatus === 'loading' && (
            <div className={styles.HistoryRowRevisionLoader}>
              <Spinner size="xxlarge" />
            </div>
          )}
          {revisionsFetchStatus === 'loaded' &&
            revisions.map(revision => {
              return (
                <HistoryRow
                  primaryText={formatDate(revision.updated_at, f)}
                  secondaryText={fileCollection.getBeautifulSize(revision)}
                  key={revision._id}
                  downloadLink={() => {
                    if (!isMobile()) {
                      fileCollection.download(
                        file,
                        revision._id,
                        CozyFile.generateFileNameForRevision(file, revision, f)
                      )
                    } else {
                      exportFilesNative(
                        client,
                        [revision],
                        CozyFile.generateFileNameForRevision(file, revision, f)
                      )
                    }
                  }}
                />
              )
            })}
        </>
      </DialogContent>
    </ExperimentalDialog>
  )
}

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
