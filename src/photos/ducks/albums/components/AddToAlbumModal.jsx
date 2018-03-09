import styles from '../../../styles/addToAlbum'

import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalSection } from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import CreateAlbumForm from './CreateAlbumForm'
import SelectAlbumsForm from './SelectAlbumsForm'
import Loading from '../../../components/Loading'

class AddToAlbumModal extends Component {
  render() {
    const {
      t,
      photos,
      data,
      fetchStatus,
      createAlbum,
      addPhotos,
      onDismiss
    } = this.props

    const isFetchingAlbums =
      fetchStatus === 'pending' || fetchStatus === 'loading'

    return (
      <Modal title={t('Albums.add_photos.title')} secondaryAction={onDismiss}>
        <ModalSection className={styles['coz-modal-section']}>
          <div className={classNames(styles['coz-create-album'])}>
            <CreateAlbumForm
              onSubmitNewAlbum={name =>
                createAlbum(name, photos).then(onDismiss)
              }
            />
          </div>
          {isFetchingAlbums ? (
            <Loading loadingType="albums_fetching" />
          ) : data && data.length > 0 ? (
            <div className={classNames(styles['coz-select-album'])}>
              <SelectAlbumsForm
                albums={{ data, fetchStatus }}
                onSubmitSelectedAlbum={album =>
                  addPhotos(album, photos).then(onDismiss)
                }
              />
            </div>
          ) : null}
        </ModalSection>
      </Modal>
    )
  }
}

export default translate()(AddToAlbumModal)
