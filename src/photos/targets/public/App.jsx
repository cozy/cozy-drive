import React, { Component } from 'react'
import flatten from 'lodash/flatten'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Query } from 'cozy-client'
import { Button, Menu, MenuItem, Icon, Spinner } from 'cozy-ui/transpiled/react'
import palette from 'cozy-ui/transpiled/react/palette'
import { Main } from 'cozy-ui/transpiled/react/Layout'

import Selection from 'photos/ducks/selection'
import { MoreButton, CozyHomeLink } from 'components/Button'
import getHomeLinkHref from 'components/Button/getHomeLinkHref'
import PhotoBoard from 'photos/components/PhotoBoard'
import styles from './index.styl'
import { ALBUM_QUERY } from '../../../../src/photos/ducks/albums/index'
import ErrorUnsharedComponent from 'photos/components/ErrorUnshared'

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

    this.context.client
      .collection('io.cozy.files')
      .downloadArchive(allPhotos.map(({ _id }) => _id), album.name)
  }

  renderViewer(children) {
    // children are injected by react-router when navigating a photo of the album
    if (!children) return null
    return React.Children.map(children, child =>
      React.cloneElement(child, {
        photos: this.props.photos
      })
    )
  }

  render() {
    const { album, hasMore, photos, fetchMore, children } = this.props

    const { t } = this.context
    return (
      <div
        data-test-id="pho-public-layout"
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
                    data-test-id="pho-toolbar-album-public"
                    className={styles['pho-toolbar']}
                    role="toolbar"
                  >
                    <CozyHomeLink
                      from="sharing-photos"
                      t={t}
                      className={styles['pho-public-mycozy']}
                    />
                    <Button
                      theme="secondary"
                      data-test-id="album-public-download"
                      className={styles['pho-public-download']}
                      onClick={() => this.onDownload(selected)}
                      icon="download"
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
                        data-test-id="album-public-create-cozy-mobile"
                        onSelect={() =>
                          (window.location = getHomeLinkHref('sharing-photos'))
                        }
                        icon={<Icon icon="cloud" />}
                      >
                        {t('Share.create-cozy')}
                      </MenuItem>
                      <MenuItem
                        data-test-id="album-public-download-mobile"
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
                {this.renderViewer(children)}
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
  hasMore: PropTypes.bool, //see https://github.com/cozy/cozy-client/issues/345
  photos: PropTypes.array.isRequired,
  fetchMore: PropTypes.func.isRequired
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

export default ConnectedApp
