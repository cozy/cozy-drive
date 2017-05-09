import styles from '../styles/photoList'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dimensions from 'react-dimensions'
import { translate } from '../lib/I18n'

import { togglePhotoSelection } from '../actions/selection'
import { mustShowSelectionBar } from '../reducers'

import Empty from '../components/Empty'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import SelectionBar from './SelectionBar'
import PhotoList from '../components/PhotoList'
import AddToAlbumModal from '../containers/AddToAlbumModal'

const Spinner = () => <div class={styles['pho-list-spinner']} />

class MoreButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetching: false
    }
  }

  handleClick () {
    this.setState({ fetching: true })
    this.props.onClick()
      .then(() => this.setState({ fetching: false }))
  }

  render () {
    const { children, width } = this.props
    const { fetching } = this.state
    return (
      <div style={{ width: width }} className={styles['pho-list-morebutton']}>
        {fetching && <Spinner />}
        {!fetching &&
          <button
            className='coz-btn coz-btn--secondary'
            onClick={() => this.handleClick()}
          >
            {children}
          </button>
        }
      </div>
    )
  }
}

export class PhotoBoard extends Component {
  render () {
    const {
      showSelection,
      selected,
      showAddToAlbumModal,
      onPhotoToggle,
      onFetchMore,
      photosContext
    } = this.props
    const { t, isFetching, isWorking, isIndexing, hasMore, containerWidth } = this.props
    const { photoLists, isError } = this.props
    const isBusy = isFetching || isWorking || isIndexing

    if (isError) {
      return (
        <div role='contentinfo'>
          <ErrorComponent errorType={`${photosContext}_photos`} />
        </div>
      )
    }

    return (
      <div
        role='contentinfo'
        className={showSelection ? styles['pho-list-selection'] : ''}
      >
        { isIndexing &&
          <Loading loadingType='photos_indexing' />
        }
        { isFetching &&
          <Loading loadingType='photos_fetching' />
        }
        { isWorking &&
          <Loading loadingType='photos_upload' />
        }
        { showAddToAlbumModal &&
          <AddToAlbumModal />
        }
        {showSelection && <SelectionBar />}
        {!isBusy && photoLists.map(photoList =>
          <PhotoList
            key={photoList.title}
            title={photoList.title}
            photos={photoList.photos}
            selected={selected}
            onPhotoToggle={onPhotoToggle}
            containerWidth={containerWidth}
          />
        )}
        {!isBusy && hasMore &&
          <MoreButton width={containerWidth} onClick={onFetchMore}>
            {t('Board.load_more')}
          </MoreButton>
        }
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
  hasMore: state.ui.hasMore,
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
)(translate()(Dimensions()(PhotoBoard)))
