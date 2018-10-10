import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalFooter, withBreakpoints, Button } from 'cozy-ui/react'
import { Query } from 'cozy-client'
import Topbar from 'drive/web/modules/layout/Topbar'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import Alerter from 'cozy-ui/react/Alerter'
import get from 'lodash/get'

import MoveHeader from './MoveHeader'

import cx from 'classnames'

import FileList from 'drive/web/modules/filelist/FileList'
import FileListHeader, {
  MobileFileListHeader
} from 'drive/web/modules/filelist/FileListHeader'
import FileListBody from 'drive/web/modules/filelist/FileListBody'
import FileListRows from 'drive/web/modules/filelist/FileListRows'
import { DumbFile as File } from 'drive/web/modules/filelist/File'
import fileListStyles from 'drive/styles/filelist'
import Oops from 'components/Error/Oops'
import { EmptyDrive } from 'components/Error/Empty'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import LoadMore from 'drive/web/modules/filelist/LoadMore'

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
    try {
      const { t } = this.context
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

  isValidMoveTarget = file => {
    const { entries } = this.props
    const isAnEntry = entries.find(entry => entry._id === file._id)

    return file.type === 'file' || isAnEntry
  }

  areEntriesInCurrentDir = () => {
    const { entries } = this.props
    const { folderId } = this.state

    const entriesInCurrentDir = entries.filter(
      entry => entry.dir_id === folderId
    )
    console.log({ folderId, entriesInCurrentDir }, entries.length)

    return entriesInCurrentDir.length === entries.length
  }

  buildBreadcrumbPath = data =>
    renamePathNames(
      getFolderPath({
        ...data,
        parent: get(data, 'relationships.parent.data')
      }),
      '',
      this.context.t
    )

  render() {
    const { onClose, entries } = this.props
    const { client, t } = this.context
    const { folderId } = this.state

    const contentQuery = client =>
      client
        .find('io.cozy.files')
        .where({
          dir_id: folderId,
          _id: {
            $ne: TRASH_DIR_ID
          }
        })
        .sortBy([{ type: 'asc' }, { name: 'asc' }])

    const breadcrumbQuery = client => client.get('io.cozy.files', folderId)

    return (
      <Modal size={'xlarge'} closable={false} overflowHidden mobileFullscreen>
        <MoveHeader entries={entries} onClose={onClose} />
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
          {({ data, fetchStatus, hasMore, fetchMore, ...rest }) => {
            if (fetchStatus === 'loading') return <FileListRowsPlaceholder />
            else if (fetchStatus === 'failed') return <Oops />
            else if (fetchStatus === 'loaded' && data.length === 0)
              return <EmptyDrive canUpload={false} />
            else
              return (
                <div
                  className={fileListStyles['fil-content-table']}
                  role="table"
                >
                  <MobileFileListHeader canSort={false} />
                  <FileListHeader canSort={false} />
                  <div className={fileListStyles['fil-content-body']}>
                    {/*Missing FileListBody providing the add folder component */}
                    <div>
                      {data.map(file => (
                        <File
                          key={file.id}
                          disabled={this.isValidMoveTarget(file)}
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
                      {hasMore && (
                        <LoadMore onClick={fetchMore} isLoading={false} />
                      )}
                    </div>
                  </div>
                </div>
              )
          }}
        </Query>
        <ModalFooter hasButtonChildren>
          <Button
            label={t('Move.cancel')}
            theme="secondary"
            onClick={onClose}
          />
          <Button
            label={t('Move.action')}
            onClick={this.moveEntries}
            disabled={this.areEntriesInCurrentDir()}
          />
        </ModalFooter>
      </Modal>
    )
  }
}

MoveModal.PropTypes = {
  entries: PropTypes.array
}

export default MoveModal
