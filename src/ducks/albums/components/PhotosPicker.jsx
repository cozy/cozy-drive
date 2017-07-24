import styles from '../../../styles/newAlbum'

import React, { Component } from 'react'
import { cozyConnect } from '../../../lib/redux-cozy-client'
import { withRouter } from 'react-router'

import { fetchTimeline, getPhotosByMonth } from '../../timeline'
import { createAlbum, fetchAlbum, addToAlbum } from '..'

import PhotoBoard from '../../../components/PhotoBoard'
import Alerter from '../../../components/Alerter'

class PhotosPicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: [],
      name: props.t('Albums.create.panel_form.placeholder')
    }
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

  onNameChange = e => {
    this.setState({ name: e.target.value })
  }

  onCancel = () => {
    this.props.router.goBack()
  }

  onCreate = async () => {
    try {
      const { name, selected } = this.state
      if (!name) {
        Alerter.error('Albums.create.error.name_missing')
        this.input.focus()
        return
      }
      // TODO: refering to the client here is not ideal, we should have
      // some kind of automatic validation system on schemas
      const unique = await this.props.client.checkUniquenessOf('io.cozy.photos.albums', 'name', name)
      if (!unique) {
        Alerter.error('Albums.create.error.already_exists', { name })
        this.input.focus()
        this.input.select()
        return
      }
      const response = await this.props.createAlbum(name)
      // TODO: not fan of this...
      const album = response.data[0]
      const addedPhotos = await this.props.addToAlbum(album, selected)

      Alerter.success('Albums.create.success', {name: name, smart_count: addedPhotos.length})
      this.props.router.push(`/albums/${album.id}`)
    } catch (error) {
      Alerter.error('Albums.create.error.generic')
      console.log(error)
    }
  }

  onUpdate = async () => {
    try {
      const { album } = this.props
      const { selected } = this.state
      // TODO: here we should try to avoid adding duplicates, but if all IDs have not been fetched on
      // the document side, we may still add duplicates... This should probably best handled by the stack/the client
      // const addedIds = selected.filter(id => photos.ids.indexOf(id) === -1)
      const addedIds = selected
      const addedPhotos = await this.props.addToAlbum(album, addedIds)
      if (addedIds.length !== selected.length) {
        Alerter.info('Alerter.photos.already_added_photo')
      } else {
        Alerter.success('Albums.add_photos.success', {name: album.name, smart_count: addedPhotos.length})
      }
      this.props.router.push(`/albums/${album.id}`)
    } catch (error) {
      console.log(error)
      Alerter.error('Albums.add_photos.error.reference')
    }
  }

  componentDidMount () {
    if (!this.props.album) {
      this.input.focus()
      this.input.select()
    }
  }

  render () {
    const { t, album } = this.props
    const { name } = this.state
    const isNew = album === null
    return (
      <div className={styles['pho-panel']}>
        <div className={styles['pho-panel-form']}>
          <header className={styles['pho-panel-header']}>
            <div className={styles['pho-panel-wrap']}>
              {isNew &&
                <div>
                  <label className={styles['coz-form-label']}>
                    {t('Albums.create.panel_form.label')}
                  </label>
                  <input
                    type='text'
                    ref={input => { this.input = input }}
                    value={name}
                    onChange={this.onNameChange}
                  />
                </div>
              }
              {!isNew && <h3>{album.name}</h3>}
            </div>
          </header>
          <div className={styles['pho-panel-content']}>
            <div className={styles['pho-panel-wrap']}>
              {this.renderBoard()}
            </div>
          </div>
          <footer className={styles['pho-panel-footer']}>
            <div className={styles['pho-panel-wrap']}>
              <div className={styles['pho-panel-controls']}>
                <button className='coz-btn coz-btn--secondary' onClick={this.onCancel}>
                  {t('Albums.create.panel_form.cancel')}
                </button>
                <button className='coz-btn coz-btn--regular' onClick={isNew ? this.onCreate : this.onUpdate}>
                  {t(isNew ? 'Albums.create.panel_form.submit' : 'Albums.create.panel_form.update')}
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }

  renderBoard () {
    const { f, photos } = this.props
    if (!photos) {
      return null
    }
    const photoLists = photos.data ? getPhotosByMonth(photos.data, f, 'MMMM YYYY') : []
    return (
      <PhotoBoard
        lists={photoLists}
        selected={this.state.selected}
        photosContext='timeline'
        showSelection
        onPhotoToggle={this.onPhotoToggle}
        onPhotosSelect={this.onPhotosSelect}
        onPhotosUnselect={this.onPhotosUnselect}
        fetchStatus={photos.fetchStatus}
        hasMore={photos.hasMore}
        onFetchMore={photos.fetchMore}
      />
    )
  }
}

const mapDocumentsToProps = (ownProps) => ({
  photos: fetchTimeline(),
  album: ownProps.params.albumId ? fetchAlbum(ownProps.params.albumId) : null
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createAlbum: (name, photos) => dispatch(createAlbum(name, photos)),
  addToAlbum: (album, photos) => dispatch(addToAlbum(album, photos))
})

export default withRouter(cozyConnect(mapDocumentsToProps, mapDispatchToProps)(PhotosPicker))
