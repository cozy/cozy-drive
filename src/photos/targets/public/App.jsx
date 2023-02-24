import React, { Component } from 'react'
import flatten from 'lodash/flatten'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { Query } from 'cozy-client'
import { Button, Menu, MenuItem, Icon, Spinner } from 'cozy-ui/transpiled/react'
import palette from 'cozy-ui/transpiled/react/palette'
import { Main } from 'cozy-ui/transpiled/react/Layout'
import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'

import Selection from 'photos/ducks/selection'
import { MoreButton, CozyHomeLink } from 'components/Button'
import { HOME_LINK_HREF } from 'photos/constants/config'
import PhotoBoard from 'photos/components/PhotoBoard'
import ErrorUnsharedComponent from 'photos/components/ErrorUnshared'
import { buildAlbumsQuery } from '../../queries/queries'
import { Outlet, useParams } from 'react-router-dom'

import styles from './index.styl'

export class App extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  }

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

    this.context.client.collection('io.cozy.files').downloadArchive(
      allPhotos.map(({ _id }) => _id),
      album.name
    )
  }

  render() {
    const { album, hasMore, photos, fetchMore } = this.props

    const { t } = this.context
    return (
      <div
        data-testid="pho-public-layout"
        className={styles['pho-public-layout']}
      >
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
                  <div
                    data-testid="pho-toolbar-album-public"
                    className={styles['pho-toolbar']}
                    role="toolbar"
                  >
                    <CozyHomeLink className={styles['pho-public-mycozy']} />
                    <Button
                      theme="secondary"
                      data-testid="album-public-download"
                      className={styles['pho-public-download']}
                      onClick={() => this.onDownload(selected)}
                      icon={DownloadIcon}
                      size="normal"
                      label={t('Toolbar.album_download')}
                    />

                    <Menu
                      title={t('Toolbar.more')}
                      component={<MoreButton />}
                      position="right"
                      className="u-hide--desk"
                    >
                      <MenuItem
                        data-testid="album-public-create-cozy-mobile"
                        onSelect={() => (window.location = HOME_LINK_HREF)}
                        icon={<Icon icon={CloudIcon} />}
                      >
                        {t('Share.create-cozy')}
                      </MenuItem>
                      <MenuItem
                        data-testid="album-public-download-mobile"
                        onSelect={() => this.onDownload(selected)}
                        icon={<Icon icon={DownloadIcon} />}
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
                <Outlet />
              </div>
            )}
          </Selection>
        </Main>
      </div>
    )
  }
}

App.propTypes = {
  album: PropTypes.object.isRequired,
  hasMore: PropTypes.bool, // see https://github.com/cozy/cozy-client/issues/345
  photos: PropTypes.array.isRequired,
  fetchMore: PropTypes.func.isRequired
}

const ConnectedApp = props => {
  const { albumId } = useParams()
  const albumsQuery = buildAlbumsQuery(albumId)
  return (
    <Query query={albumsQuery.definition} as={albumsQuery.as} {...props}>
      {({ data: album, fetchStatus }) => {
        if (fetchStatus === 'failed') {
          return <ErrorUnsharedComponent />
        }
        if (fetchStatus === 'loaded') {
          return (
            <App
              album={album}
              photos={album.photos.data}
              hasMore={album.photos.hasMore}
              fetchMore={album.photos.fetchMore.bind(album.photos)}
            >
              {props.children}
            </App>
          )
        } else {
          return (
            <Spinner
              size={'xxlarge'}
              loadingType={'photos_fetching'}
              middle={true}
              color={palette.dodgerBlue}
            />
          )
        }
      }}
    </Query>
  )
}

export default ConnectedApp
