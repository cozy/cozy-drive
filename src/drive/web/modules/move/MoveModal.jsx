import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import { Query, cancelable, withClient, Q } from 'cozy-client'
import { CozyFile } from 'models'
import { withVaultUnlockContext } from 'cozy-keys-lib'
import logger from 'lib/logger'

import { RefreshableSharings } from 'cozy-sharing'
import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import { withBreakpoints } from 'cozy-ui/transpiled/react'

import Header from 'drive/web/modules/move/Header'
import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import Footer from 'drive/web/modules/move/Footer'
import Topbar from 'drive/web/modules/move/Topbar'

import { getDisplayedFolder } from 'drive/web/modules/selectors'
import {
  buildMoveOrImportQuery,
  buildOnlyFolderQuery
} from 'drive/web/modules/queries'
import {
  isEncryptedFolder,
  isEncryptedFile,
  getEncryptionKeyFromDirId,
  encryptAndUploadExistingFile,
  decryptAndUploadExistingFile,
  reencryptAndUploadExistingFile
} from 'drive/lib/encryption'

const styles = theme => ({
  paper: {
    height: '100%',
    '& .MuiDialogContent-root': {
      padding: '0'
    },
    '& .MuiDialogTitle-root': {
      padding: '0',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        overflow: 'visible',
        // back button
        '& .MuiButtonBase-root': {
          display: 'none'
        }
      }
    }
  }
})

export class MoveModal extends React.Component {
  constructor(props) {
    super(props)
    this.promises = []
    const { displayedFolder } = props
    this.state = {
      targetFolder: displayedFolder,
      isMoveInProgress: false
    }
  }

  componentWillUnmount() {
    this.unregisterCancelables()
  }

  navigateTo = folder => {
    this.setState({ targetFolder: folder })
  }

  registerCancelable = promise => {
    if (!this.promises) this.promises = []
    const cancelableP = cancelable(promise)
    this.promises.push(cancelableP)
    return cancelableP
  }

  unregisterCancelables = () => {
    this.promises.forEach(p => p.cancel())
    this.promises = []
  }

  moveEncryptedEntry = async (
    client,
    vaultClient,
    entry,
    { isEncryptedTarget, isEncryptedFileEntry, targetFolder, sourceFolder }
  ) => {
    if (isEncryptedTarget && !isEncryptedFileEntry) {
      // The plaintext file is moved to an encrypted directory
      const encryptionKey = await getEncryptionKeyFromDirId(
        client,
        targetFolder._id
      )

      await encryptAndUploadExistingFile(client, vaultClient, {
        file: entry,
        encryptionKey
      })
    } else if (!isEncryptedTarget && isEncryptedFileEntry) {
      // The encrypted file is moved to a plaintext directory
      const decryptionKey = await getEncryptionKeyFromDirId(
        client,
        sourceFolder._id
      )

      await decryptAndUploadExistingFile(client, vaultClient, {
        file: entry,
        decryptionKey
      })
    } else if (isEncryptedTarget && isEncryptedFileEntry) {
      // The encrypted file is moved to another encrypted directory
      const encryptionKey = await getEncryptionKeyFromDirId(
        client,
        targetFolder._id
      )
      const decryptionKey = await getEncryptionKeyFromDirId(
        client,
        sourceFolder._id
      )
      await reencryptAndUploadExistingFile(client, vaultClient, {
        file: entry,
        decryptionKey,
        encryptionKey
      })
    }
  }

  moveEntry = async (
    entry,
    targetFolder,
    { sharedPaths, isEncryptedTarget, client, vaultClient }
  ) => {
    const { displayedFolder } = this.props
    const isEncryptedFileEntry = isEncryptedFile(entry)
    if (isEncryptedTarget || isEncryptedFileEntry) {
      await this.moveEncryptedEntry(client, vaultClient, entry, {
        isEncryptedTarget,
        isEncryptedFileEntry,
        targetFolder,
        sourceFolder: displayedFolder
      })
    }

    const targetPath = await CozyFile.getFullpath(targetFolder._id, entry.name)
    const force = !sharedPaths.includes(targetPath)
    return CozyFile.move(entry._id, { folderId: targetFolder._id }, force)
  }

  moveEntries = async callback => {
    const { client, vaultClient, entries, onClose, sharingState, t } =
      this.props
    const { sharedPaths } = sharingState
    const { targetFolder } = this.state
    try {
      this.setState({ isMoveInProgress: true })
      const isEncryptedTarget = isEncryptedFolder(targetFolder)
      const trashedFiles = []
      await Promise.all(
        entries.map(async entry => {
          const moveResponse = await this.registerCancelable(
            this.moveEntry(entry, targetFolder, {
              sharedPaths,
              isEncryptedTarget,
              client,
              vaultClient
            })
          )
          if (moveResponse.deleted) {
            trashedFiles.push(moveResponse.deleted)
          }
        })
      )

      const response = await this.registerCancelable(
        client.query(Q('io.cozy.files').getById(targetFolder._id))
      )
      const targetName = response.data.name
      Alerter.info('Move.success', {
        subject: entries.length === 1 ? entries[0].name : '',
        target: targetName,
        smart_count: entries.length,
        buttonText: t('Move.cancel'),
        buttonAction: () =>
          this.cancelMove(entries, trashedFiles, callback, { targetFolder })
      })
      this.trackEvent(entries.length)
      if (callback) callback()
    } catch (e) {
      logger.warn(e)
      Alerter.error('Move.error', { smart_count: entries.length })
    } finally {
      this.setState({ isMoveInProgress: false })
      onClose({
        cancelSelection: true
      })
    }
  }

  cancelMove = async (entries, trashedFiles, callback) => {
    const { client, vaultClient, displayedFolder } = this.props
    const { targetFolder } = this.state
    try {
      const isEncryptedDisplayedFolder = isEncryptedFolder(displayedFolder)
      const isEncryptedTargetFolder = isEncryptedFolder(targetFolder)

      await Promise.all(
        entries.map(async entry => {
          if (isEncryptedDisplayedFolder || isEncryptedTargetFolder) {
            this.registerCancelable(
              this.moveEncryptedEntry(client, vaultClient, entry, {
                isEncryptedTarget: isEncryptedDisplayedFolder,
                isEncryptedFileEntry: isEncryptedTargetFolder,
                targetFolder: displayedFolder,
                sourceFolder: targetFolder
              })
            )
          }
          return this.registerCancelable(
            CozyFile.move(entry._id, { folderId: entry.dir_id })
          )
        })
      )
      const fileCollection = client.collection(CozyFile.doctype)
      let restoreErrorsCount = 0
      await Promise.all(
        trashedFiles.map(id => {
          try {
            this.registerCancelable(fileCollection.restore(id))
          } catch {
            restoreErrorsCount++
          }
        })
      )
      if (restoreErrorsCount) {
        Alerter.info('Move.cancelledWithRestoreErrors', {
          subject: entries.length === 1 ? entries[0].name : '',
          smart_count: entries.length,
          restoreErrorsCount
        })
      } else {
        Alerter.info('Move.cancelled', {
          subject: entries.length === 1 ? entries[0].name : '',
          smart_count: entries.length
        })
      }
    } catch (e) {
      logger.warn(e)
      Alerter.error('Move.cancelled_error', { smart_count: entries.length })
    } finally {
      if (callback) callback()
    }
  }

  trackEvent(eventValue) {
    const tracker = getTracker()
    if (tracker) {
      tracker.push(['trackEvent', 'Drive', 'move', 'moveTo', eventValue])
    }
  }

  render() {
    const {
      onClose,
      entries,
      classes,
      breakpoints: { isMobile }
    } = this.props
    const { targetFolder, isMoveInProgress } = this.state

    const contentQuery = buildMoveOrImportQuery(targetFolder._id)
    const folderQuery = buildOnlyFolderQuery(targetFolder._id)

    return (
      <FixedDialog
        open
        onClose={isMobile ? undefined : onClose}
        size="large"
        classes={{
          paper: classes.paper
        }}
        title={
          <>
            <Header entries={entries} />
            <Query
              query={folderQuery.definition()}
              fetchPolicy={folderQuery.options.fetchPolicy}
              as={folderQuery.options.as}
              key={`breadcrumb-${targetFolder._id}`}
            >
              {({ data, fetchStatus }) => (
                <Topbar
                  navigateTo={this.navigateTo}
                  currentDir={data}
                  fetchStatus={fetchStatus}
                />
              )}
            </Query>
          </>
        }
        content={
          <Query
            query={contentQuery.definition()}
            fetchPolicy={contentQuery.options.fetchPolicy}
            as={contentQuery.options.as}
            key={`content-${targetFolder._id}`}
          >
            {({ data, fetchStatus, hasMore, fetchMore }) => {
              return (
                <Explorer>
                  <Loader
                    fetchStatus={fetchStatus}
                    hasNoData={data.length === 0}
                  >
                    <FileList
                      files={data}
                      entries={entries}
                      navigateTo={this.navigateTo}
                    />
                    <LoadMore hasMore={hasMore} fetchMore={fetchMore} />
                  </Loader>
                </Explorer>
              )
            }}
          </Query>
        }
        actions={
          <RefreshableSharings>
            {({ refresh }) => (
              <Footer
                onConfirm={() => this.moveEntries(refresh)}
                onClose={onClose}
                targets={entries}
                currentDirId={targetFolder._id}
                isMoving={isMoveInProgress}
              />
            )}
          </RefreshableSharings>
        }
      />
    )
  }
}

MoveModal.propTypes = {
  client: PropTypes.object.isRequired,
  displayedFolder: PropTypes.object.isRequired,
  entries: PropTypes.array,
  t: PropTypes.func.isRequired,
  // in case of move conflicts, shared files are not overridden
  sharingState: PropTypes.object
}

const mapStateToProps = state => ({
  displayedFolder: getDisplayedFolder(state)
})

export default compose(
  connect(mapStateToProps),
  translate(),
  withClient,
  withVaultUnlockContext,
  withSharingState,
  withStyles(styles),
  withBreakpoints()
)(MoveModal)
