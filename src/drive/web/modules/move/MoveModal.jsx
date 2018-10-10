import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'cozy-ui/react'
import { Query } from 'cozy-client'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import Alerter from 'cozy-ui/react/Alerter'
import { connect } from 'react-redux'

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

    const entry = entries[0]
    const currentDirId = entry.dir_id

    try {
      const response = await client.query(client.get('io.cozy.files', folderId))
      const targetName = response.data.name
      await this.moveEntry(entry._id, folderId)
      Alerter.info(
        t('Move.success', {
          subject: entry.name,
          target: targetName
        }),
        {
          buttonText: t('Move.cancel'),
          buttonAction: () => this.cancelMove(entry, currentDirId)
        }
      )
    } catch (e) {
      console.warn(e)
      Alerter.error(t('Move.error'))
    } finally {
      onClose({
        cancelSelection: true
      })
    }
  }

  moveEntry = (entryId, destinationId) => {
    return this.context.client
      .collection('io.cozy.files')
      .updateFileMetadata(entryId, { dir_id: destinationId })
  }

  cancelMove = async (entry, previousDirId) => {
    const { t } = this.context

    try {
      await this.moveEntry(entry._id, previousDirId)
      Alerter.info(
        t('Move.cancelled', {
          subject: entry.name
        })
      )
    } catch (e) {
      console.warn(e)
      Alerter.error(t('Move.cancelled_error'))
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
