import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'cozy-ui/react'
import { Query } from 'cozy-client'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import Alerter from 'cozy-ui/react/Alerter'
import { connect } from 'react-redux'
import { getTracker } from 'cozy-ui/react/helpers/tracker'

import MoveHeader from './MoveHeader'
import MoveExplorer from './MoveExplorer'
import MoveFileList from './MoveFileList'
import MoveLoader from './MoveLoader'
import MoveLoadMore from './MoveLoadMore'
import MoveFooter from './MoveFooter'
import MoveTopbar from './MoveTopbar'

class MoveModal extends React.Component {
  constructor(props) {
    super(props)

    const { displayedFolder } = props
    this.state = {
      folderId: displayedFolder ? displayedFolder._id : ROOT_DIR_ID
    }
  }

  navigateTo = folder => {
    this.setState({ folderId: folder.id })
  }

  moveEntries = async () => {
    const { entries, onClose } = this.props
    const { client, t } = this.context
    const { folderId } = this.state

    try {
      await Promise.all(
        entries.map(entry => this.moveEntry(entry._id, folderId))
      )
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
      console.warn(e)
      Alerter.error(t('Move.error', { smart_count: entries.length }))
    } finally {
      onClose({
        cancelSelection: true
      })
    }
  }

  cancelMove = async entries => {
    const { t } = this.context

    try {
      await Promise.all(
        entries.map(entry => this.moveEntry(entry._id, entry.dir_id))
      )
      Alerter.info(
        t('Move.cancelled', {
          subject: entries.length === 1 ? entries[0].name : '',
          smart_count: entries.length
        })
      )
    } catch (e) {
      console.warn(e)
      Alerter.error(t('Move.cancelled_error', { smart_count: entries.length }))
    }
  }

  moveEntry = (entryId, destinationId) => {
    return this.context.client
      .collection('io.cozy.files')
      .updateFileMetadata(entryId, { dir_id: destinationId })
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
    const { onClose, entries } = this.props
    const { folderId } = this.state

    return (
      <Modal size={'xlarge'} closable={false} overflowHidden mobileFullscreen>
        <MoveHeader entries={entries} onClose={onClose} />
        <Query query={this.breadcrumbQuery} key={`breadcrumb-${folderId}`}>
          {({ data, fetchStatus }) => (
            <MoveTopbar
              navigateTo={this.navigateTo}
              currentDir={data}
              fetchStatus={fetchStatus}
            />
          )}
        </Query>
        <Query query={this.contentQuery} key={`content-${folderId}`}>
          {({ data, fetchStatus, hasMore, fetchMore }) => {
            return (
              <MoveExplorer>
                <MoveLoader
                  fetchStatus={fetchStatus}
                  hasNoData={data.length === 0}
                >
                  <div>
                    <MoveFileList
                      files={data}
                      targets={entries}
                      navigateTo={this.navigateTo}
                    />
                    <MoveLoadMore hasMore={hasMore} fetchMore={fetchMore} />
                  </div>
                </MoveLoader>
              </MoveExplorer>
            )
          }}
        </Query>
        <MoveFooter
          onConfirm={this.moveEntries}
          onClose={onClose}
          targets={entries}
          currentDirId={folderId}
        />
      </Modal>
    )
  }
}

MoveModal.PropTypes = {
  entries: PropTypes.array
}

const mapStateToProps = state => ({
  displayedFolder: state.view.displayedFolder
})

export default connect(mapStateToProps)(MoveModal)
