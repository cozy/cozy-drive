/* global cozy */
import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import PhotoBoard from '../components/PhotoBoard'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'

import { fetchAlbum, fetchPhotos, downloadAlbum } from '../ducks/albums'

import styles from './index.styl'

class App extends Component {
  state = {
    album: null,
    photos: [],
    selected: [],
    loading: true,
    hasMore: false
  }

  onPhotoToggle = id => {
    this.setState(({ selected }) => {
      const idx = selected.findIndex(i => i === id)
      return {
        selected: idx === -1
          ? [...selected, id]
          : [...selected.slice(0, idx), ...selected.slice(idx + 1)]
      }
    })
  }

  onFetchMore = () => {
    return fetchPhotos(this.state.album, this.state.photos.length)
      .then(({ entries, next }) => this.setState(state => ({
        photos: [...state.photos, ...entries],
        hasMore: next
      })))
  }

  onDownload = () => {
    const photos = this.state.selected.length !== 0
      ? this.getSelectedPhotos()
      : this.state.photos
    downloadAlbum(this.state.album, photos)
  }

  getSelectedPhotos = () => {
    const { photos, selected } = this.state
    return selected.map(id => photos.find(p => p._id === id))
  }

  async componentDidMount () {
    const { albumId } = this.props
    if (!albumId) {
      return this.setState({ error: 'Missing ID' })
    }
    try {
      const album = await fetchAlbum(albumId)
      const { entries, next } = await fetchPhotos(album)
      this.setState(state => ({
        album,
        photos: entries,
        loading: false,
        hasMore: next
      }))
    } catch (ex) {
      console.log(ex)
      return this.setState({ error: 'Sharing disabled', ex })
    }
  }

  render () {
    if (this.state.error) {
      return (
        <div className={styles['pho-public-layout']}>
          <ErrorComponent errorType={`public_album`} />
        </div>
      )
    }
    if (this.state.loading) {
      return (
        <div className={styles['pho-public-layout']}>
          <Loading loadingType='photos_fetching' />
        </div>
      )
    }
    const { t } = this.props
    const { album, photos, selected, hasMore } = this.state
    return (
      <div className={styles['pho-public-layout']}>
        <div className={styles['pho-content-header']}>
          <h2 className={styles['pho-content-title']}>{album.name}</h2>
          <div className={styles['pho-toolbar']} role='toolbar'>
            <div className='coz-desktop'>
              <button
                role='button'
                className={['coz-btn', 'coz-btn--secondary', styles['pho-public-download']].join(' ')}
                onClick={this.onDownload}
              >
                {t('Toolbar.album_download')}
              </button>
            </div>
          </div>
        </div>
        <PhotoBoard
          lists={[{ photos }]}
          selected={selected}
          showSelection={selected.length !== 0}
          onPhotoToggle={this.onPhotoToggle}
          hasMore={hasMore}
          onFetchMore={this.onFetchMore}
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

export default translate()(App)
