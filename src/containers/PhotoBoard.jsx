import styles from '../styles/photoList'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { togglePhotoSelection } from '../actions/selection'
import { mustShowSelectionBar } from '../reducers'

import Empty from '../components/Empty'
import SelectionBar from './SelectionBar'
import PhotoList from '../components/PhotoList'
import AddToAlbumModal from '../containers/AddToAlbumModal'

export class PhotoBoard extends Component {
  render () {
    const { photoLists, showSelection, selected, showAddToAlbumModal, onPhotoToggle } = this.props
    return (
      <div
        role='contentinfo'
        className={showSelection ? styles['pho-list-selection'] : ''}
      >
        { showAddToAlbumModal &&
          <AddToAlbumModal />
        }
        {showSelection && <SelectionBar />}
        {photoLists.map(photoList => {
          return (<PhotoList
            key={photoList.title}
            title={photoList.title}
            photos={photoList.photos}
            selected={selected}
            onPhotoToggle={onPhotoToggle}
          />)
        })}
        {photoLists.length === 0 && <Empty emptyType='photos' />}
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
)(translate()(PhotoBoard))
