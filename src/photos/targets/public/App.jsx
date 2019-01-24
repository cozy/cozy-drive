import React, { Component } from 'react'
import flatten from 'lodash/flatten'
import classNames from 'classnames'

import { Query } from 'cozy-client'
import { Button, Menu, MenuItem, Icon, Spinner } from 'cozy-ui/react'
import { IconSprite } from 'cozy-ui/transpiled/react'
import { Main } from 'cozy-ui/react/Layout'

import Selection from 'photos/ducks/selection'
import { MoreButton, CozyHomeLink } from 'components/Button'
import PhotoBoard from 'photos/components/PhotoBoard'
import styles from './index.styl'
import { ALBUM_QUERY } from '../../../../src/photos/ducks/albums/index'
import ErrorUnsharedComponent from 'photos/components/ErrorUnshared'

class App extends Component {
  onDownload = selected => {
    const photos = selected.length !== 0 ? selected : null
    this.downloadPhotos(photos)
  }

  downloadPhotos = async photos => {
    let allPhotos
    const { album } = this.props
    if (photos !== null) {
      allPhotos = flatten(photos)
    } else {
      const photosRequested = await this.context.client
        .getStackClient()
        .collection('io.cozy.files')
        .findReferencedBy(
          {
            _type: 'io.cozy.photos.albums',
            _id: album.id
          },
          { limit: 99999 }
        )
      allPhotos = photosRequested.data
    }

    this.context.client
      .collection('io.cozy.files')
      .downloadArchive(allPhotos.map(({ _id }) => _id), album.name)
  }

  componentWillReceiveProps(nextProps) {
    const { fetchStatus } = nextProps
    if (fetchStatus === 'failed') {
      this.setState({ error: 'Fetch error' })
    }
  }

  render() {
    const { album, hasMore, photos, fetchMore } = this.props

    const { t } = this.context
    if (this.state.error) {
      return <ErrorUnsharedComponent />
    }
    return (
      <div className={styles['pho-public-layout']}>
        <Main className="u-pt-1-half">
          <Selection>
            {(selected, active, selection) => (
              <div>
                <div
                  className={classNames(
                    styles['pho-content-header'],
                    styles['--no-icon'],
                    styles['--hide-bar']
                  )}
                >
                  <h2 className={styles['pho-content-title']}>{album.name}</h2>
                  <div className={styles['pho-toolbar']} role="toolbar">
                    <CozyHomeLink from="sharing-photos" t={t} />
                    <Button
                      theme="secondary"
                      className={styles['pho-public-download']}
                      onClick={() => this.onDownload(selected)}
                      icon="download"
                      label={t('Toolbar.album_download')}
                    />

                    <Menu
                      title={t('Toolbar.more')}
                      component={<MoreButton />}
                      position="right"
                      className="u-hide--desk"
                    >
                      <MenuItem
                        onSelect={() => this.onDownload(selected)}
                        icon={<Icon icon="download" />}
                      >
                        {t('Toolbar.album_download')}
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
                <PhotoBoard
                  lists={[{ photos }]}
                  selected={selected}
                  photosContext="timeline"
                  showSelection={active}
                  onPhotoToggle={selection.toggle}
                  onPhotosSelect={selection.select}
                  onPhotosUnselect={selection.unselect}
                  fetchStatus={photos.fetchStatus}
                  hasMore={hasMore}
                  fetchMore={fetchMore}
                />
              </div>
            )}
          </Selection>
          <IconSprite />
        </Main>
      </div>
    )
  }
}

const ConnectedApp = props => (
  <Query query={ALBUM_QUERY} {...props}>
    {({ data: album, fetchStatus }) => {
      if (fetchStatus === 'failed') {
        return <ErrorUnsharedComponent />
      }
      if (fetchStatus === 'loaded') {
        return (
          <App
            album={album}
            photos={album.photos.data}
            fetchStatus={fetchStatus}
            hasMore={album.photos.hasMore}
            fetchMore={album.photos.fetchMore.bind(album.photos)}
            {...props}
          />
        )
      } else {
        return (
          <Spinner
            size={'xxlarge'}
            loadingType={'photos_fetching'}
            middle={true}
          />
        )
      }
    }}
  </Query>
)

export default ConnectedApp
