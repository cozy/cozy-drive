import React, { Component } from 'react'
import { connect } from 'react-redux'

import { isSelectionBarVisible, getSelectedIds, toggleItemSelection } from '../ducks/selection'

import Empty from '../components/Empty'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import SelectionBarWithActions from './SelectionBarWithActions'
import PhotoBoard from '../components/PhotoBoard'
import AddToAlbumModal from '../containers/AddToAlbumModal'

class BoardView extends Component {
  render () {
    const {
      showSelection,
      selected,
      isAddToAlbumModalOpened,
      onPhotoToggle,
      selectionModeActive,
      photosContext
    } = this.props

    const {
      photoLists,
      fetchStatus,
      hasMore,
      onFetchMore
    } = this.props

    return (
      <div role='contentinfo'>
        {isAddToAlbumModalOpened && <AddToAlbumModal />}
        {selectionModeActive && <SelectionBarWithActions />}
        <PhotoBoard
          lists={photoLists}
          selected={selected}
          photosContext={photosContext}
          showSelection={selectionModeActive}
          onPhotoToggle={onPhotoToggle}
          fetchStatus={fetchStatus}
          hasMore={hasMore}
          onFetchMore={onFetchMore}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  selected: getSelectedIds(state),
  selectionModeActive: isSelectionBarVisible(state),
  isAddToAlbumModalOpened: state.ui.isAddToAlbumModalOpened
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onPhotoToggle: (id, selected) => {
    dispatch(toggleItemSelection(id, selected))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardView)
