import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'cozy-ui/react'
import { Query } from 'cozy-client'
import FileList from 'drive/web/modules/filelist/FileList'
import Topbar from 'drive/web/modules/layout/Topbar'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

class MoveModal extends React.Component {
  state = {
    folderId: ROOT_DIR_ID
  }

  navigateTo = folder => {
    this.setState({ folderId: folder.id })
  }

  sortData = data => {
    const folders = data.filter(
      entry => entry.type === 'directory' && entry.id !== TRASH_DIR_ID
    )
    const files = data.filter(entry => entry.type !== 'directory')

    return folders.concat(files)
  }

  render() {
    const { onClose } = this.props
    const { client } = this.context
    const { folderId } = this.state
    const query = client =>
      client
        .find('io.cozy.files')
        .where({ dir_id: folderId })
        .sortBy({ name: 'asc' })

    return (
      <Modal size={'xlarge'} closable={false} overflowHidden={true}>
        <Topbar>topbar content</Topbar>
        <Query query={query} key={folderId}>
          {({ data, fetchStatus }) => {
            return (
              <FileList
                withSelectionCheckbox={false}
                canSort={false}
                fileActions={[]}
                files={this.sortData(data)}
                selectionModeActive={false}
                actionMenuActive={false}
                onFolderOpen={id =>
                  this.navigateTo(data.find(f => f.id === id))
                }
              />
            )
          }}
        </Query>
        <div>
          <Button>Déplacer</Button>
          <Button theme="secondary" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </Modal>
    )
  }
}

export default MoveModal
