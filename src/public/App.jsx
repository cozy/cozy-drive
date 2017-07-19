import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'

import PhotoBoard from '../components/PhotoBoard'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import ErrorShare from '../components/ErrorShare'

import { getAlbum, getAlbumPhotos, fetchAlbum, fetchAlbumPhotos, downloadAlbum } from '../ducks/albums'

import classNames from 'classnames'
import styles from './index.styl'

class App extends Component {
  state = {
    selected: []
  }

  onPhotoToggle = obj => {
    this.setState(({ selected }) => {
      const idx = selected.findIndex(i => i === obj.id)
      return {
        selected: idx === -1
          ? [...selected, obj.id]
          : [...selected.slice(0, idx), ...selected.slice(idx + 1)]
      }
    })
  }

  onPhotosSelect = ids => {
    this.setState(({ selected }) => {
      const newIds = ids.filter(id => selected.indexOf(id) === -1)
      return {
        selected: [...selected, ...newIds]
      }
    })
  }

  onPhotosUnselect = ids => {
    this.setState(({ selected }) => {
      return {
        selected: selected.filter(id => ids.indexOf(id) === -1)
      }
    })
  }

  onDownload = () => {
    const photos = this.state.selected.length !== 0
      ? this.getSelectedPhotos()
      : this.props.photos.entries
    downloadAlbum(this.props.album, photos)
  }

  getSelectedPhotos = () => {
    const { selected } = this.state
    const { photos } = this.props
    return selected.map(id => photos.entries.find(p => p.id === id))
  }

  componentDidMount () {
    const { albumId } = this.props
    if (!albumId) {
      return this.setState({ error: 'Missing ID' })
    }
    this.props.fetchAlbum(albumId)
      .catch(() => this.setState({ error: 'Fetch error' }))
  }

  render () {
    const { t, album, photos, fetchMorePhotos } = this.props
    if (this.state.error) {
      return (
        <div className={styles['pho-public-layout']}>
          <ErrorShare errorType={`public_album_unshared`} />
        </div>
      )
    }
    if (photos && photos.error) {
      return (
        <div className={styles['pho-public-layout']}>
          <ErrorComponent errorType={`public_album_error`} />
        </div>
      )
    }
    if (!album || !photos || photos.fetchStatus !== 'loaded') {
      return (
        <div className={styles['pho-public-layout']}>
          <Loading loadingType='photos_fetching' />
        </div>
      )
    }
    const { entries, hasMore } = photos
    const { selected } = this.state
    return (
      <div className={styles['pho-public-layout']}>
        <div className={classNames(styles['pho-content-header'], styles['--no-icon'])}>
          <h2 className={styles['pho-content-title']}>{album.name}</h2>
          <div className={styles['pho-toolbar']} role='toolbar'>
            <div className='coz-desktop'>
              <button
                role='button'
                className={classNames('coz-btn', 'coz-btn--secondary', styles['pho-public-download'])}
                onClick={this.onDownload}
              >
                {t('Toolbar.album_download')}
              </button>
            </div>
          </div>
        </div>
        <PhotoBoard
          lists={[{ photos: entries }]}
          selected={selected}
          showSelection={selected.length !== 0}
          onPhotoToggle={this.onPhotoToggle}
          onPhotosSelect={this.onPhotosSelect}
          onPhotosUnselect={this.onPhotosUnselect}
          hasMore={hasMore}
          onFetchMore={() => fetchMorePhotos(album, entries.length)}
        />
        {this.renderViewer(this.props.children)}
      </div>
    )
  }

  renderViewer (children) {
    if (!children) return null
    return React.Children.map(children, child => React.cloneElement(child, {
      photos: this.state.photos
    }))
  }
}

const mapStateToProps = (state, ownProps) => ({
  album: getAlbum(state, ownProps.albumId),
  photos: getAlbumPhotos(state, ownProps.albumId)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAlbum: (id) => dispatch(fetchAlbum(id)),
  fetchMorePhotos: (album, skip) => dispatch(fetchAlbumPhotos(album, skip))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(App))
