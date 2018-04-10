import React, { Component } from 'react'
import { Query } from 'cozy-client'

import Selection from 'photos/ducks/selection'
import PhotoBoard from 'photos/components/PhotoBoard'
import Loading from 'photos/components/Loading'
import ErrorShare from 'components/Error/ErrorShare'
import { Button } from 'cozy-ui/react'
import { MoreButton, CozyHomeLink } from 'components/Button'
import Menu, { Item } from 'components/Menu'

import classNames from 'classnames'
import styles from './index.styl'

class App extends Component {
  onDownload = selected => {
    const photos =
      selected.length !== 0 ? selected : this.props.album.photos.data
    this.downloadPhotos(photos)
  }

  downloadPhotos(photos) {
    this.context.client
      .collection('io.cozy.files')
      .downloadArchive(photos.map(({ _id }) => _id), this.props.album.name)
  }

  componentWillReceiveProps(nextProps) {
    const { fetchStatus } = nextProps
    if (fetchStatus === 'failed') {
      this.setState({ error: 'Fetch error' })
    }
  }

  render() {
    const { album, fetchStatus } = this.props
    const { t } = this.context
    if (this.state.error) {
      return (
        <div
          className={classNames(
            styles['pho-public-layout'],
            styles['pho-public-layout--full']
          )}
        >
          <ErrorShare errorType={`public_album_unshared`} />
        </div>
      )
    }
    if (fetchStatus === 'pending' || fetchStatus === 'loading') {
      return (
        <div className={styles['pho-public-layout']}>
          <Loading loadingType="photos_fetching" />
        </div>
      )
    }
    const { data, next, fetchMore } = album.photos
    return (
      <div className={styles['pho-public-layout']}>
        <Selection>
          {(selected, active, selection) => (
            <div>
              <div
                className={classNames(
                  styles['pho-content-header'],
                  styles['--no-icon']
                )}
              >
                <h2 className={styles['pho-content-title']}>{album.name}</h2>
                <div className={styles['pho-toolbar']} role="toolbar">
                  <Button
                    theme="secondary"
                    className={styles['pho-public-download']}
                    onClick={() => this.onDownload(selected)}
                    icon="download"
                    label={t('Toolbar.album_download')}
                  />
                  <CozyHomeLink from="sharing-photos" />
                  <Menu
                    title={t('Toolbar.more')}
                    className={classNames(styles['pho-toolbar-menu'])}
                    button={<MoreButton>{t('Toolbar.more')}</MoreButton>}
                  >
                    <Item>
                      <a
                        className={classNames(styles['pho-public-download'])}
                        onClick={() => this.onDownload(selected)}
                      >
                        {t('Toolbar.album_download')}
                      </a>
                    </Item>
                  </Menu>
                </div>
              </div>
              <PhotoBoard
                photosContext="shared_album"
                lists={[{ photos: data }]}
                selected={selected}
                showSelection={active}
                onPhotoToggle={selection.toggle}
                onPhotosSelect={selection.select}
                onPhotosUnselect={selection.unselect}
                hasMore={next}
                onFetchMore={fetchMore}
              />
              {this.renderViewer(this.props.children)}
            </div>
          )}
        </Selection>
      </div>
    )
  }

  renderViewer(children) {
    if (!children) return null
    return React.Children.map(children, child =>
      React.cloneElement(child, {
        photos: this.props.album.photos.data
      })
    )
  }
}

const ConnectedApp = props => (
  <Query
    query={client =>
      client
        .get('io.cozy.photos.albums', props.router.params.albumId)
        .include(['photos'])
    }
  >
    {({ data, fetchStatus }) => (
      <App album={data ? data[0] : null} fetchStatus={fetchStatus} />
    )}
  </Query>
)

export default ConnectedApp
