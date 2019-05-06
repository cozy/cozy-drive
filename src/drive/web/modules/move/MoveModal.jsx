import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'cozy-ui/react'
import { Query } from 'cozy-client'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import Alerter from 'cozy-ui/react/Alerter'
import { connect } from 'react-redux'
import { getTracker } from 'cozy-ui/react/helpers/tracker'

import Header from './Header'
import Explorer from './Explorer'
import FileList from './FileList'
import Loader from './Loader'
import LoadMore from './LoadMore'
import Footer from './Footer'
import Topbar from './Topbar'

class MoveModal extends React.Component {
  static contextTypes = {
    client: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)

    const { displayedFolder } = props
    this.state = {
      folderId: displayedFolder ? displayedFolder._id : ROOT_DIR_ID,
      isMoveInProgress: false
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
      this.setState({ isMoveInProgress: true })
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
      // eslint-disable-next-line no-console
      console.warn(e)
      Alerter.error(t('Move.error', { smart_count: entries.length }))
    } finally {
      this.setState({ isMoveInProgress: false })
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
      // eslint-disable-next-line no-console
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
    const { folderId, isMoveInProgress } = this.state

    return (
      <Modal size={'xlarge'} closable={false} overflowHidden mobileFullscreen>
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

export default connect(mapStateToProps)(MoveModal)
