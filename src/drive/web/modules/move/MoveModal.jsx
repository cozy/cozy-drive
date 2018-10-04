import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, ContextHeader, withBreakpoints } from 'cozy-ui/react'
import { Query } from 'cozy-client'
import Topbar from 'drive/web/modules/layout/Topbar'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import Alerter from 'cozy-ui/react/Alerter'
import DriveIcon from 'drive/assets/icons/icon-drive.svg'

import cx from 'classnames'

import FileList from 'drive/web/modules/filelist/FileList'
import FileListHeader, {
  MobileFileListHeader
} from 'drive/web/modules/filelist/FileListHeader'
import FileListBody from 'drive/web/modules/filelist/FileListBody'
import FileListRows from 'drive/web/modules/filelist/FileListRows'
import File from 'drive/web/modules/filelist/File'
import fileListStyles from 'drive/styles/filelist'

import {
  Breadcrumb,
  PreviousButton,
  renamePathNames
} from 'drive/web/modules/navigation/Breadcrumb'
import getFolderPath from 'drive/web/modules/navigation/getFolderPath'

const MoveTopbar = withBreakpoints()(
  ({ navigateTo, path, breakpoints: { isMobile } }) => (
    <Topbar hideOnMobile={false}>
      {path.length > 1 &&
        isMobile && (
          <PreviousButton onClick={() => navigateTo(path[path.length - 2])} />
        )}
      <Breadcrumb path={path} onBreadcrumbClick={navigateTo} opening={false} />
    </Topbar>
  )
)

class MoveModal extends React.Component {
  state = {
    folderId: ROOT_DIR_ID
  }

  navigateTo = folder => {
    this.setState({ folderId: folder.id })
  }

  moveEntries = async () => {
    const { entries, onClose } = this.props
    const { client } = this.context
    const { folderId } = this.state

    const entry = entries[0]

    try {
      await client
        .collection('io.cozy.files')
        .updateFileMetadata(entry._id, { dir_id: folderId })
      Alerter.info('*Thing* has been moved to *destination*', {
        buttonText: 'cancel',
        buttonAction: () => console.log('cancel move plz')
      })
    } catch (e) {
      console.warn(e)
      Alerter.error('move error')
    } finally {
      onClose({
        cancelSelection: true
      })
    }
  }

  sortData = data => {
    const folders = data.filter(
      entry => entry.type === 'directory' && entry.id !== TRASH_DIR_ID
    )
    const files = data.filter(entry => entry.type !== 'directory')

    return folders.concat(files)
  }

  buildBreadcrumbPath = data =>
    renamePathNames(
      getFolderPath({
        ...data,
        parent: data.relationships.parent.data
      }),
      '',
      this.context.t
    )

  render() {
    const { onClose } = this.props
    const { client, t } = this.context
    const { folderId } = this.state

    const contentQuery = client =>
      client
        .find('io.cozy.files')
        .where({ dir_id: folderId })
        .sortBy({ name: 'asc' })

    const breadcrumbQuery = client => client.get('io.cozy.files', folderId)

    return (
      <Modal size={'xlarge'} closable={false} overflowHidden mobileFullscreen>
        <ContextHeader
          title={'yo yo'}
          text={'gros'}
          icon={DriveIcon}
          onClose={onClose}
        />
        <Query query={breadcrumbQuery} key={`breadcrumb-${folderId}`}>
          {({ data, fetchStatus }) => {
            return fetchStatus === 'loaded' ? (
              <MoveTopbar
                navigateTo={this.navigateTo}
                path={this.buildBreadcrumbPath(data)}
              />
            ) : (
              false
            )
          }}
        </Query>
        <Query query={contentQuery} key={`content-${folderId}`}>
          {({ data, fetchStatus }) => {
            return (
              <div className={fileListStyles['fil-content-table']} role="table">
                <MobileFileListHeader canSort={false} />
                <FileListHeader canSort={false} />
                <div className={fileListStyles['fil-content-body']}>
                  {/*Missing FileListBody providing the loading state, the empty state and the add folder component */}
                  <div>
                    {/*Missing FileListRows providing the load more  */}
                    {this.sortData(data).map(file => (
                      <File
                        key={file.id}
                        attributes={file}
                        displayedFolder={null}
                        actions={null}
                        isRenaming={false}
                        onFolderOpen={id =>
                          this.navigateTo(data.find(f => f.id === id))
                        }
                        onFileOpen={null}
                        withSelectionCheckbox={false}
                        withFilePath={false}
                        withSharedBadge={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          }}
        </Query>
        <div>
          <Button theme="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={this.moveEntries}>Déplacer</Button>
        </div>
      </Modal>
    )
  }
}

MoveModal.PropTypes = {
  entries: PropTypes.array
}

export default MoveModal
