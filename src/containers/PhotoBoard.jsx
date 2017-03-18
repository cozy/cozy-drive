import styles from '../styles/photoList'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { togglePhotoSelection } from '../actions/selection'
import { mustShowSelectionBar } from '../lib/helpers'

import Empty from '../components/Empty'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import SelectionBar from './SelectionBar'
import PhotoList from '../components/PhotoList'
import AddToAlbumModal from '../containers/AddToAlbumModal'

export class PhotoBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFetching: true,
      photoLists: []
    }

    this.fetchPhotoLists(props)
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (!this.state.isFetching && nextProps.refetch) {
      this.fetchPhotoLists(nextProps)
    }
  }

  fetchPhotoLists (props) {
    props.fetchPhotoLists().then(photoLists => {
      this.setState({
        isFetching: false,
        photoLists: photoLists
      })
    }).catch(photosError => {
      console.error(photosError)
      this.setState({isFetching: false, isError: true})
    })
  }

  render () {
    const {
      showSelection,
      selected,
      showAddToAlbumModal,
      onPhotoToggle,
      photosContext
    } = this.props
    const { isFetching, isWorking, isIndexing } = this.props
    const isGloballyFetching = isFetching || (!isIndexing && this.state.isFetching)
    const { photoLists, isError } = this.state
    const isBusy = isGloballyFetching || isWorking || isIndexing
    if (isError) {
      return <div role='contentinfo'>
        <ErrorComponent errorType={`${photosContext}_photos`} />
      </div>
    }
    return (
      <div
        role='contentinfo'
        className={showSelection ? styles['pho-list-selection'] : ''}
      >
        { isIndexing &&
          <Loading loadingType='photos_indexing' />
        }
        { isGloballyFetching &&
          <Loading loadingType='photos_fetching' />
        }
        { isWorking &&
          <Loading loadingType='photos_upload' />
        }
        { showAddToAlbumModal &&
          <AddToAlbumModal />
        }
        {showSelection && <SelectionBar />}
        {!isBusy && photoLists.map(photoList => {
          return (<PhotoList
            key={photoList.title}
            title={photoList.title}
            photos={photoList.photos}
            selected={selected}
            onPhotoToggle={onPhotoToggle}
          />)
        })}
        {!isBusy && photoLists.length === 0 &&
          <Empty emptyType={`${photosContext}_photos`} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  isIndexing: state.ui.isIndexing,
  isWorking: state.ui.isWorking,
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
