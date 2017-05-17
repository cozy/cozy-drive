import styles from '../styles/photoList'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
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
        {fetching &&
          <button className='coz-btn' disabled>
            <Spinner />
          </button>
        }
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
      t,
      containerWidth,
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

    return (
      <AutoSizer>
        {({ width, height }) => (
          <div
            role='contentinfo'
            className={showSelection ? styles['pho-list-selection'] : ''}
          >
            { showAddToAlbumModal &&
              <AddToAlbumModal />
            }
            {showSelection && <SelectionBar />}
            {!isFetching && photoLists.map(photoList =>
              <PhotoList
                key={photoList.title}
                title={photoList.title}
                photos={photoList.photos}
                selected={selected}
                onPhotoToggle={onPhotoToggle}
                containerWidth={width}
              />
            )}
            {!isFetching && hasMore &&
              <MoreButton width={width} onClick={onFetchMore}>
                {t('Board.load_more')}
              </MoreButton>
            }
            {!isFetching && photoLists.length === 0 &&
              <Empty emptyType={`${photosContext}_photos`} />
            }
          </div>
        )}
      </AutoSizer>
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
