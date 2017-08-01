import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  isSelectionBarVisible,
  getSelectedIds,
  toggleItemSelection,
  addToSelection,
  removeFromSelection
} from '../ducks/selection'
import { isRelated } from '../ducks/timeline'

import SelectionBarWithActions from './SelectionBarWithActions'
import PhotoBoard from '../components/PhotoBoard'
import AddToAlbumModal from '../containers/AddToAlbumModal'

class BoardView extends Component {
  render () {
    const {
      album,
      related,
      readOnly,
      selected,
      isAddToAlbumModalOpened,
      onPhotoToggle,
      onPhotosSelect,
      onPhotosUnselect,
      selectionModeActive,
      photosContext
    } = this.props

    const {
      photoLists,
      photos
    } = this.props

    return (
      <div role='contentinfo'>
        {isAddToAlbumModalOpened && <AddToAlbumModal />}
        {selectionModeActive && <SelectionBarWithActions album={album} related={related} readOnly={readOnly} />}
        <PhotoBoard
          lists={photoLists}
          selected={selected}
          photosContext={photosContext}
          showSelection={selectionModeActive}
          onPhotoToggle={onPhotoToggle}
          onPhotosSelect={onPhotosSelect}
          onPhotosUnselect={onPhotosUnselect}
          fetchStatus={photos.fetchStatus}
          hasMore={photos.hasMore}
          onFetchMore={photos.fetchMore}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  selected: getSelectedIds(state),
  related: isRelated(state, ownProps.photos.data),
  selectionModeActive: isSelectionBarVisible(state),
  isAddToAlbumModalOpened: state.ui.isAddToAlbumModalOpened
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onPhotoToggle: (id, selected) => {
    dispatch(toggleItemSelection(id, selected))
  },
  onPhotosSelect: (ids) => {
    dispatch(addToSelection(ids))
  },
  onPhotosUnselect: (ids) => {
    dispatch(removeFromSelection(ids))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardView)
