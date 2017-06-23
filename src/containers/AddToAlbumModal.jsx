import styles from '../styles/addToAlbum'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalSection } from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import Alerter from '../components/Alerter'
import CreateAlbumForm from '../components/CreateAlbumForm'
import SelectAlbumsForm from '../components/SelectAlbumsForm'
import Loading from '../components/Loading'

import { getSelectedIds } from '../ducks/selection'

import {
  fetchAlbums,
  getAlbumsList,
  createAlbum,
  addToAlbum,
  checkUniquenessOfAlbumName,
  cancelAddToAlbum,
  closeAddToAlbum
} from '../ducks/albums'

import { refetchSomePhotos } from '../ducks/timeline'

export class AddToAlbumModal extends Component {
  componentWillMount () {
    this.props.fetchAlbums()
  }

  render (props) {
    const {
      t,
      photos,
      albums,
      onDismiss,
      onSubmitNewAlbum,
      onSubmitSelectedAlbum
    } = props

    const fetchStatus = albums ? albums.fetchStatus : 'loading'
    const isFetchingAlbums = fetchStatus === 'pending' || fetchStatus === 'loading'

    return (
      <Modal
        title={t('Albums.add_photos.title')}
        secondaryAction={() => onDismiss()}
        >
        <ModalSection className={styles['coz-modal-section']}>
          <div className={classNames(styles['coz-create-album'])}>
            <CreateAlbumForm
              onSubmitNewAlbum={name => onSubmitNewAlbum(name, photos)}
              />
          </div>
          {
            isFetchingAlbums
            ? <Loading loadingType='albums_fetching' />
            : albums && albums.entries.length > 0
            ? <div className={classNames(styles['coz-select-album'])}>
              <SelectAlbumsForm albums={albums} onSubmitSelectedAlbum={album => onSubmitSelectedAlbum(album, photos)} />
            </div>
            : null
          }
        </ModalSection>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    photos: getSelectedIds(state),
    albums: getAlbumsList(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelAddToAlbum())
  },
  onSubmitNewAlbum: async (name, photos) => {
    try {
      if (!name) {
        Alerter.error('Albums.create.error.name_missing')
        return
      }
      // TODO: we should not have to dispatch this method (see comments in redux-cozy-api)
      const unique = await dispatch(checkUniquenessOfAlbumName(name))
      if (!unique) {
        Alerter.error('Albums.create.error.already_exists', { name })
        return
      }
      const album = await dispatch(createAlbum(name, photos))
      // TODO: sadly we need to refetch the photos so that their relationships
      // property get updated and so that isRelated works when deleting a photo
      // that has just been added to an album
      await dispatch(refetchSomePhotos(photos))
      dispatch(closeAddToAlbum())
      Alerter.success('Albums.create.success', {name: album.name, smart_count: photos.length})
    } catch (error) {
      Alerter.error('Albums.create.error.generic')
    }
  },
  onSubmitSelectedAlbum: async (album, photos) => {
    try {
      const addedPhotos = await dispatch(addToAlbum(album, photos))
      if (addedPhotos.length !== photos.length) {
        Alerter.info('Alerter.photos.already_added_photo')
      } else {
        Alerter.success('Albums.add_photos.success', {name: album.name, smart_count: photos.length})
      }
      // TODO: sadly we need to refetch the photos so that their relationships
      // property get updated and so that isRelated works when deleting a photo
      // that has just been added to an album
      await dispatch(refetchSomePhotos(photos))
      dispatch(closeAddToAlbum())
    } catch (error) {
      console.log(error)
      Alerter.error('Albums.add_photos.error.reference')
    }
  },
  fetchAlbums: () => dispatch(fetchAlbums())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))
