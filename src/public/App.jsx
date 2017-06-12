/* global cozy */
import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import PhotoBoard from '../components/PhotoBoard'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import {
  ALBUM_DOCTYPE
} from '../constants/config'

import styles from './index.styl'

class App extends Component {
  state = {
    name: null,
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

  }

  onDownload = () => {

  }

  async componentDidMount () {
    const { albumId } = this.props
    if (!albumId) {
      return this.setState({ error: 'Missing ID' })
    }
    const album = {
      _type: ALBUM_DOCTYPE,
      _id: albumId
    }
    try {
      const photosIds = await cozy.client.data.listReferencedFiles(album)
      const photos = await Promise.all(photosIds.map(cozy.client.files.statById))
      // const photosWithUrl = await Promise.all(photos.map(addUrl))
      const document = await cozy.client.data.find(ALBUM_DOCTYPE, albumId)
      this.setState(state => ({
        name: document.name,
        photos,
        loading: false
      }))
    } catch (ex) {
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
    const { name, photos, selected, hasMore } = this.state
    return (
      <div className={styles['pho-public-layout']}>
        <div className={styles['pho-content-header']}>
          <h2 className={styles['pho-content-title']}>{name}</h2>
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
