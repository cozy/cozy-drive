import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Modal } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import { Query, withClient } from 'cozy-client'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import Alerter from 'cozy-ui/react/Alerter'
import { connect } from 'react-redux'
import { getTracker } from 'cozy-ui/react/helpers/tracker'
import flag from 'cozy-flags'

import { CozyFile } from 'models'
import logger from 'lib/logger'
import withSharingState from 'sharing/hoc/withSharingState'
import Header from './Header'
import Explorer from './Explorer'
import FileList from './FileList'
import Loader from './Loader'
import LoadMore from './LoadMore'
import Footer from './Footer'
import Topbar from './Topbar'

export class MoveModal extends React.Component {
  constructor(props) {
    super(props)

    const { displayedFolder } = props
    this.state = {
      trashedFiles: [], // files we trashed because of conflicts
      folderId: displayedFolder ? displayedFolder._id : ROOT_DIR_ID,
      isMoveInProgress: false
    }
  }

  navigateTo = folder => {
    this.setState({ folderId: folder.id })
  }

  moveEntries = async () => {
    const { client, entries, onClose, sharingState, t } = this.props
    const { sharedPaths } = sharingState
    const { folderId } = this.state
    try {
      this.setState({ isMoveInProgress: true, trashedFiles: [] })
      const trashedFiles = []
      await Promise.all(
        entries.map(async entry => {
          const targetPath = await CozyFile.getFullpath(folderId, entry.name)
          const force =
            flag('handle-move-conflicts') && !sharedPaths.includes(targetPath)
          const moveResponse = await CozyFile.move(
            entry._id,
            { folderId },
            force
          )
          if (moveResponse.deleted) {
            trashedFiles.push(moveResponse.deleted)
          }
        })
      )
      this.setState({ trashedFiles })

      const response = await client.query(client.get('io.cozy.files', folderId))
      const targetName = response.data.name
      Alerter.info(
        t('Move.success', {
          subject: entries.length === 1 ? entries[0].name : '',
          target: targetName,
          smart_count: entries.length
        }),
        {
          buttonText: t('Move.cancel'),
          buttonAction: () => this.cancelMove(entries)
        }
      )
      this.trackEvent(entries.length)
    } catch (e) {
      logger.warn(e)
      Alerter.error(t('Move.error', { smart_count: entries.length }))
    } finally {
      this.setState({ isMoveInProgress: false })
      onClose({
        cancelSelection: true
      })
    }
  }

  cancelMove = async entries => {
    const { client, t } = this.props
    try {
      await Promise.all(
        entries.map(entry =>
          CozyFile.move(entry._id, { folderId: entry.dir_id })
        )
      )
      const fileCollection = client.collection(CozyFile.doctype)
      let restoreErrorsCount = 0
      await Promise.all(
        this.state.trashedFiles.map(async id => {
          try {
            await fileCollection.restore(id)
          } catch (e) {
            restoreErrorsCount++
          }
        })
      )
      this.setState({ trashedFiles: [] })

      if (restoreErrorsCount) {
        Alerter.info(
          t('Move.cancelledWithRestoreErrors', {
            subject: entries.length === 1 ? entries[0].name : '',
            smart_count: entries.length,
            restoreErrorsCount
          })
        )
      } else {
        Alerter.info(
          t('Move.cancelled', {
            subject: entries.length === 1 ? entries[0].name : '',
            smart_count: entries.length
          })
        )
      }
    } catch (e) {
      logger.warn(e)
      Alerter.error(t('Move.cancelled_error', { smart_count: entries.length }))
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
      .sortBy([{ type: 'asc' }, { name: 'asc' }])
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
  entries: PropTypes.array
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
