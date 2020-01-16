import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Modal } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Query, cancelable, withClient } from 'cozy-client'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { connect } from 'react-redux'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'

import { CozyFile } from 'models'
import logger from 'lib/logger'
import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import Header from 'drive/web/modules/move/Header'
import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import Footer from 'drive/web/modules/move/Footer'
import Topbar from 'drive/web/modules/move/Topbar'

export class MoveModal extends React.Component {
  constructor(props) {
    super(props)
    this.promises = []
    const { displayedFolder } = props
    this.state = {
      folderId: displayedFolder ? displayedFolder._id : ROOT_DIR_ID,
      isMoveInProgress: false
    }
  }

  componentWillUnmount() {
    this.unregisterCancelables()
  }

  navigateTo = folder => {
    this.setState({ folderId: folder.id })
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

  moveEntries = async () => {
    const { client, entries, onClose, sharingState, t } = this.props
    const { sharedPaths } = sharingState
    const { folderId } = this.state
    try {
      this.setState({ isMoveInProgress: true })
      const trashedFiles = []
      await Promise.all(
        entries.map(async entry => {
          const targetPath = await this.registerCancelable(
            CozyFile.getFullpath(folderId, entry.name)
          )
          const force = !sharedPaths.includes(targetPath)
          const moveResponse = await this.registerCancelable(
            CozyFile.move(entry._id, { folderId }, force)
          )
          if (moveResponse.deleted) {
            trashedFiles.push(moveResponse.deleted)
          }
        })
      )

      const response = await this.registerCancelable(
        client.query(client.get('io.cozy.files', folderId))
      )
      const targetName = response.data.name
      Alerter.info('Move.success', {
        subject: entries.length === 1 ? entries[0].name : '',
        target: targetName,
        smart_count: entries.length,
        buttonText: t('Move.cancel'),
        buttonAction: () => this.cancelMove(entries, trashedFiles)
      })
      this.trackEvent(entries.length)
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

  cancelMove = async (entries, trashedFiles) => {
    const { client } = this.props
    try {
      await Promise.all(
        entries.map(entry =>
          this.registerCancelable(
            CozyFile.move(entry._id, { folderId: entry.dir_id })
          )
        )
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
    }
  }

  trackEvent(eventValue) {
    const tracker = getTracker()
    if (tracker) {
      tracker.push(['trackEvent', 'Drive', 'move', 'moveTo', eventValue])
    }
  }

  contentQuery = client => {
    return client
      .find('io.cozy.files')
      .where({
        dir_id: this.state.folderId,
        _id: {
          $ne: TRASH_DIR_ID
        }
      })
      .indexFields(['dir_id', 'type', 'name'])
      .sortBy([{ dir_id: 'asc' }, { type: 'asc' }, { name: 'asc' }])
  }

  breadcrumbQuery = client => {
    return client.get('io.cozy.files', this.state.folderId)
  }

  render() {
    const { onClose, entries, t } = this.props
    const { folderId, isMoveInProgress } = this.state
    return (
      <Modal
        size={'xlarge'}
        closable={false}
        overflowHidden
        mobileFullscreen
        into="body"
        aria-label={t('Move.modalTitle')}
        className={'u-mih-100'}
      >
        <Header entries={entries} onClose={onClose} />
        <Query query={this.breadcrumbQuery} key={`breadcrumb-${folderId}`}>
          {({ data, fetchStatus }) => (
            <Topbar
              navigateTo={this.navigateTo}
              currentDir={data}
              fetchStatus={fetchStatus}
            />
          )}
        </Query>
        <Query query={this.contentQuery} key={`content-${folderId}`}>
          {({ data, fetchStatus, hasMore, fetchMore }) => {
            return (
              <Explorer>
                <Loader fetchStatus={fetchStatus} hasNoData={data.length === 0}>
                  <div>
                    <FileList
                      files={data}
                      targets={entries}
                      navigateTo={this.navigateTo}
                    />
                    <LoadMore hasMore={hasMore} fetchMore={fetchMore} />
                  </div>
                </Loader>
              </Explorer>
            )
          }}
        </Query>
        <Footer
          onConfirm={this.moveEntries}
          onClose={onClose}
          targets={entries}
          currentDirId={folderId}
          isMoving={isMoveInProgress}
        />
      </Modal>
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
  displayedFolder: state.view.displayedFolder
})

export default compose(
  connect(mapStateToProps),
  translate(),
  withClient,
  withSharingState
)(MoveModal)
