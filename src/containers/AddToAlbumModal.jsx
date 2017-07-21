import styles from '../styles/addToAlbum'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cozyConnect } from '../lib/redux-cozy-client'
import Modal, { ModalSection } from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import Alerter from '../components/Alerter'
import CreateAlbumForm from '../components/CreateAlbumForm'
import SelectAlbumsForm from '../components/SelectAlbumsForm'
import Loading from '../components/Loading'

import { getSelectedIds } from '../ducks/selection'

import {
  fetchAlbums,
  createAlbum,
  addToAlbum,
  cancelAddToAlbum,
  closeAddToAlbum
} from '../ducks/albums'

export class AddToAlbumModal extends Component {
  onDismiss = () => {
    this.props.dispatch(cancelAddToAlbum())
  }

  onSubmitNewAlbum = async (name, photos) => {
    const { dispatch } = this.props
    try {
      if (!name) {
        Alerter.error('Albums.create.error.name_missing')
        return
      }
      // TODO: refering to the client here is not ideal, we should have
      // some kind of automatic validation system on schemas
      const unique = await this.props.client.checkUniquenessOf('io.cozy.photos.albums', 'name', name)
      if (!unique) {
        Alerter.error('Albums.create.error.already_exists', { name })
        return
      }
      const response = await dispatch(createAlbum(name))
      // TODO: not fan of this...
      const album = response.data[0]
      const addedPhotos = await dispatch(addToAlbum(album, photos))
      dispatch(closeAddToAlbum())
      Alerter.success('Albums.create.success', {name: album.name, smart_count: addedPhotos.length})
    } catch (error) {
      Alerter.error('Albums.create.error.generic')
    }
  }

  onSubmitSelectedAlbum = async (album, photos) => {
    const { dispatch } = this.props
    try {
      const addedPhotos = await dispatch(addToAlbum(album, photos))
      if (addedPhotos.length !== photos.length) {
        Alerter.info('Alerter.photos.already_added_photo')
      } else {
        Alerter.success('Albums.add_photos.success', {name: album.name, smart_count: photos.length})
      }
      dispatch(closeAddToAlbum())
    } catch (error) {
      console.log(error)
      Alerter.error('Albums.add_photos.error.reference')
    }
  }

  render () {
    const { t, photos, albums } = this.props

    const fetchStatus = albums ? albums.fetchStatus : 'loading'
    const isFetchingAlbums = fetchStatus === 'pending' || fetchStatus === 'loading'

    return (
      <Modal
        title={t('Albums.add_photos.title')}
        secondaryAction={this.onDismiss}
        >
        <ModalSection className={styles['coz-modal-section']}>
          <div className={classNames(styles['coz-create-album'])}>
            <CreateAlbumForm
              onSubmitNewAlbum={name => this.onSubmitNewAlbum(name, photos)}
              />
          </div>
          {
            isFetchingAlbums
            ? <Loading loadingType='albums_fetching' />
            : albums && albums.data.length > 0
            ? <div className={classNames(styles['coz-select-album'])}>
              <SelectAlbumsForm albums={albums} onSubmitSelectedAlbum={album => this.onSubmitSelectedAlbum(album, photos)} />
            </div>
            : null
          }
        </ModalSection>
      </Modal>
    )
  }
}

const mapDocumentsToProps = (ownProps) => ({ albums: fetchAlbums() })
const mapStateToProps = (state, ownProps) => ({ photos: getSelectedIds(state) })

export default connect(mapStateToProps)(cozyConnect(mapDocumentsToProps)(AddToAlbumModal))
