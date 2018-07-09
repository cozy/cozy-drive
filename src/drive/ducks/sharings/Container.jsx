/* global __TARGET__ */
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { showModal } from 'react-cozy-helpers'
import confirm from '../../lib/confirm'
import { SharedDocuments } from 'sharing'

import { fetchSharings } from '../../actions'

import FolderView from '../../components/FolderView'
import DeleteConfirm from '../../components/DeleteConfirm'
import Toolbar from '../files/Toolbar'
import {
  isRenaming,
  getRenamingFile,
  startRenamingAsync
} from '../files/rename'
import { isFile, isReferencedByAlbum } from '../files/files'
import { isAvailableOffline } from '../files/availableOffline'
import { ConnectedToggleMenuItem } from '../../components/FileActionMenu'

import {
  createFolder,
  openFileWith,
  downloadFiles,
  exportFilesNative,
  trashFiles,
  toggleAvailableOffline
} from '../../actions'

const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

const mapStateToProps = (state, ownProps) => ({
  isRenaming: isRenaming(state),
  renamingFile: getRenamingFile(state),
  Toolbar,
  isAvailableOffline: isAvailableOffline(state)
})

const mapDispatchToProps = (dispatch, ownProps) => {
  const { hasWriteAccess } = ownProps
  return {
    actions: Object.assign({}, ownProps.actions, {
      list: {
        createFolder: name => dispatch(createFolder(name))
      },
      selection: {
        share: {
          action: selected =>
            dispatch({
              ...showModal(
                <ShareModal
                  document={selected[0]}
                  documentType="Files"
                  sharingDesc={selected[0].name}
                />
              ),
              meta: {
                hideActionMenu: true
              }
            }),
          displayCondition: selections =>
            hasWriteAccess && selections.length === 1
        },
        download:
          __TARGET__ === 'mobile'
            ? {
                action: files => dispatch(exportFilesNative(files)),
                displayCondition: files =>
                  files.reduce(
                    (onlyFiles, file) => onlyFiles && isFile(file),
                    true
                  )
              }
            : {
                action: files => dispatch(downloadFiles(files))
              },
        trash: {
          action: files =>
            confirm(
              <DeleteConfirm
                t={ownProps.t}
                fileCount={files.length}
                referenced={isAnyFileReferencedByAlbum(files)}
              />
            )
              .then(() => dispatch(trashFiles(files)))
              .catch(() => {}),
          displayCondition: selections => hasWriteAccess
        },
        openWith: {
          action: files => dispatch(openFileWith(files[0].id, files[0].name)),
          displayCondition: selections =>
            __TARGET__ === 'mobile' &&
            selections.length === 1 &&
            isFile(selections[0])
        },
        rename: {
          action: selected => dispatch(startRenamingAsync(selected[0])),
          displayCondition: selections =>
            hasWriteAccess && selections.length === 1
        },
        'phone-download': {
          action: selected => dispatch(toggleAvailableOffline(selected[0])),
          displayCondition: selections =>
            __TARGET__ === 'mobile' &&
            selections.length === 1 &&
            isFile(selections[0]),
          Component: props => <ConnectedToggleMenuItem {...props} />
        }
      }
    })
  }
}

// quelque part ici : on mount / props change, dispatcher les sharings vers redux
const ConnectedFolderView = translate()(
  connect(mapStateToProps, mapDispatchToProps)(FolderView)
)

class SharingFetcher extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sharingIds: []
    }
  }

  async componentDidUpdate(prevProps) {
    const { sharings } = this.props.sharingProps
    const { client } = this.context
    const sharingIds = sharings.map(
      sharing => sharing.attributes.rules[0].values[0]
    )

    const hasChanged = sharingIds.find(
      id => !this.state.sharingIds.includes(id)
    )

    if (hasChanged && sharingIds.length > 0) {
      this.setState({ sharingIds })

      const resp = await client
        .collection('io.cozy.files')
        .all({ keys: sharingIds })
      const files = resp.data

      this.props.fetchSharings(files)
    }
  }

  render() {
    const { sharingProps, ...otherProps } = this.props

    return (
      <ConnectedFolderView
        isTrashContext={false}
        canSort
        canDrop
        canUpload
        canCreateFolder={false}
        {...otherProps}
      />
    )
  }
}

const ConnectedSharingFetcher = connect(null, dispatch => ({
  fetchSharings: f => dispatch(fetchSharings(f))
}))(SharingFetcher)

const SharingsContainer = props => (
  <SharedDocuments>
    {sharingProps => (
      <ConnectedSharingFetcher {...props} sharingProps={sharingProps} />
    )}
  </SharedDocuments>
)

export default SharingsContainer
