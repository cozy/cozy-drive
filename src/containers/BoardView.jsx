import React, { Component } from 'react'
import { connect } from 'react-redux'

import { togglePhotoSelection } from '../actions/selection'
import { mustShowSelectionBar } from '../reducers'

import Empty from '../components/Empty'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import SelectionBar from './SelectionBar'
import PhotoBoard from '../components/PhotoBoard'
import AddToAlbumModal from '../containers/AddToAlbumModal'

class BoardView extends Component {
  render () {
    const {
      showSelection,
      selected,
      showAddToAlbumModal,
      onPhotoToggle,
      photosContext
    } = this.props

    const {
      photoLists,
      fetchStatus,
      hasMore,
      onFetchMore
    } = this.props

    const isError = fetchStatus === 'failed'
    const isFetching = fetchStatus === 'pending' || fetchStatus === 'loading'

    if (isError) {
      return (
        <div role='contentinfo'>
          <ErrorComponent errorType={`${photosContext}_photos`} />
        </div>
      )
    }

    if (isFetching) {
      return (
        <div role='contentinfo'>
          <Loading loadingType='photos_fetching' />
        </div>
      )
    }

    if (!isFetching && (photoLists.length === 0 || photoLists[0].photos.length === 0)) {
      return (
        <div role='contentinfo'>
          <Empty emptyType={`${photosContext}_photos`} />
        </div>
      )
    }

    return (
      <div>
        {showAddToAlbumModal && <AddToAlbumModal />}
        {showSelection && <SelectionBar />}
        <PhotoBoard
          lists={photoLists}
          selected={selected}
          showSelection={showSelection}
          onPhotoToggle={onPhotoToggle}
          hasMore={hasMore}
          onFetchMore={onFetchMore}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  selected: state.ui.selected,
  showSelection: mustShowSelectionBar(state),
  showAddToAlbumModal: state.ui.showAddToAlbumModal
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onPhotoToggle: (id, selected) => {
    dispatch(togglePhotoSelection(id, selected))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardView)
