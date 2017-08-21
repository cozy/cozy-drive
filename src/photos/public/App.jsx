import React, { Component } from 'react'
import { cozyConnect } from '../lib/redux-cozy-client'

import PhotoBoard from '../components/PhotoBoard'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import ErrorShare from '../components/ErrorShare'
import Menu, { Item } from '../components/Menu'

import { fetchAlbum, fetchAlbumPhotos, downloadAlbum } from '../ducks/albums'

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
      : this.props.photos.data
    downloadAlbum(this.props.album, photos)
  }

  getSelectedPhotos = () => {
    const { selected } = this.state
    const { photos } = this.props
    return selected.map(id => photos.data.find(p => p.id === id))
  }

  componentDidMount () {
    const { albumId } = this.props
    if (!albumId) {
      return this.setState({ error: 'Missing ID' })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { album, photos } = nextProps
    if (photos.fetchStatus === 'failed' && album === null) {
      this.setState({error: 'Fetch error'})
    }
  }

  render () {
    const { t, album, photos } = this.props
    if (this.state.error) {
      return (
        <div className={classNames(styles['pho-public-layout'], styles['pho-public-layout--full'])}>
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
    if (!album || !photos || photos.fetchStatus === 'pending' || photos.fetchStatus === 'loading') {
      return (
        <div className={styles['pho-public-layout']}>
          <Loading loadingType='photos_fetching' />
        </div>
      )
    }
    const { data, hasMore, fetchMore } = photos
    const { selected } = this.state
    return (
      <div className={styles['pho-public-layout']}>
        <div className={classNames(styles['pho-content-header'], styles['--no-icon'])}>
          <h2 className={styles['pho-content-title']}>{album.name}</h2>
          <div className={styles['pho-toolbar']} role='toolbar'>
            <button
              role='button'
              className={classNames('coz-btn', 'coz-btn--secondary', styles['pho-public-download'])}
              onClick={this.onDownload}
            >
              {t('Toolbar.album_download')}
            </button>
            <Menu
              title={t('Toolbar.more')}
              className={classNames(styles['pho-toolbar-menu'])}
              buttonClassName={styles['pho-toolbar-more-btn']}
            >
              <Item>
                <a
                  className={classNames(styles['pho-public-download'])}
                  onClick={this.onDownload}
                >
                  {t('Toolbar.album_download')}
                </a>
              </Item>
            </Menu>
          </div>
        </div>
        <PhotoBoard
          lists={[{ photos: data }]}
          selected={selected}
          showSelection={selected.length !== 0}
          onPhotoToggle={this.onPhotoToggle}
          onPhotosSelect={this.onPhotosSelect}
          onPhotosUnselect={this.onPhotosUnselect}
          hasMore={hasMore}
          onFetchMore={fetchMore}
        />
        {this.renderViewer(this.props.children)}
      </div>
    )
  }

  renderViewer (children) {
    if (!children) return null
    return React.Children.map(children, child => React.cloneElement(child, {
      photos: this.props.photos.data
    }))
  }
}

const mapDocumentsToProps = (ownProps) => ({
  album: fetchAlbum(ownProps.albumId),
  // TODO: not ideal, but we'll have to wait after associations are implemented
  photos: fetchAlbumPhotos({ type: 'io.cozy.photos.albums', id: ownProps.albumId })
})

export default cozyConnect(mapDocumentsToProps)(App)
