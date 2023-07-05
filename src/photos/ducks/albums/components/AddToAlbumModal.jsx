import styles from '../../../styles/addToAlbum.styl'

import React, { Component } from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import classNames from 'classnames'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Divider from 'cozy-ui/transpiled/react/Divider'

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
      onDismiss,
      onSuccess = () => {}
    } = this.props

    const isFetchingAlbums =
      fetchStatus === 'pending' || fetchStatus === 'loading'

    return (
      <Dialog
        open={true}
        onClose={onDismiss}
        title={t('Albums.add_photos.title')}
        content={
          <div>
            <div>
              <CreateAlbumForm
                onSubmitNewAlbum={name =>
                  createAlbum(name, photos).then(onDismiss).then(onSuccess)
                }
              />
              <Divider className="u-ml-0 u-maw-100 u-mt-1" />
              {isFetchingAlbums && <Loading loadingType="albums_fetching" />}
              {!isFetchingAlbums && data && data.length > 0 && (
                <div className={classNames(styles['coz-select-album'])}>
                  <SelectAlbumsForm
                    albums={{ data, fetchStatus }}
                    onSubmitSelectedAlbum={album =>
                      addPhotos(album, photos).then(onDismiss).then(onSuccess)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        }
      />
    )
  }
}

export default translate()(AddToAlbumModal)
