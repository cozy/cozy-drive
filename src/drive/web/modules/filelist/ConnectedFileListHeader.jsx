import { connect } from 'react-redux'
import {
  sortFolder,
  getSort,
  getOpenedFolderId
} from 'drive/web/modules/navigation/duck'
import { toggleThumbnailSize } from '../navigation/duck/actions'
import DesktopHeader from './FileListHeader'
import MobileHeader from './MobileFileListHeader'

const mapStateToProps = state => ({
  sort: getSort(state),
  folderId: getOpenedFolderId(state),
  thumbnailSizeBig: state.view.thumbnailSize
})
const mapDispatchToProps = dispatch => ({
  onFolderSort: (folderId, attr, order) =>
    dispatch(sortFolder(folderId, attr, order)),
  toggleThumbnailSize: () => dispatch(toggleThumbnailSize())
})

export const FileListHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(DesktopHeader)
export const MobileFileListHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileHeader)
