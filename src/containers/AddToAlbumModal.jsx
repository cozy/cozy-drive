import styles from '../styles/addToAlbum'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import Alerter from '../components/Alerter'
import CreateAlbumForm from '../components/CreateAlbumForm'
import SelectAlbumsForm from '../components/SelectAlbumsForm'
import Loading from '../components/Loading'

import {
  fetchAlbums,
  getAlbumsList,
  cancelAddToAlbum,
  closeAddToAlbum,
  createAlbum,
  addToAlbum }
from '../ducks/albums'

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

    const { fetchingStatus } = props.albums ? props.albums : { fetchingStatus: 'loading' }
    const isFetchingAlbums = fetchingStatus === 'pending' || fetchingStatus === 'loading'

    return (
      <Modal
        title={t('Albums.add_photos.title')}
        secondaryAction={() => onDismiss()}
        >
        <div className={classNames(styles['coz-modal-section'])}>
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
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    photos: state.ui.selected,
    albums: getAlbumsList(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelAddToAlbum())
  },
  onSubmitNewAlbum: (name, photos) => {
    return dispatch(createAlbum(name, photos))
      .then(() => {
        dispatch(closeAddToAlbum())
        Alerter.success('Albums.create.success', {name: name, smart_count: photos.length})
      })
  },
  onSubmitSelectedAlbum: (album, photos) => {
    return dispatch(addToAlbum(album, photos))
      .then(() => {
        dispatch(closeAddToAlbum())
        Alerter.success('Albums.add_photos.success', {name: album.name, smart_count: photos.length})
      })
  },
  fetchAlbums: () => dispatch(fetchAlbums())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))
