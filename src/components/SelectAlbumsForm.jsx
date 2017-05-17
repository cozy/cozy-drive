import styles from '../styles/albumsList'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { withError } from '../components/ErrorComponent'
import { withEmpty } from '../components/Empty'

import Loading from '../components/Loading'
import AlbumItem from '../components/AlbumItem'

import { fetchAlbums, getAlbumsList } from '../ducks/albums'

const DumbAlbumsList = props => (
  <div className={classNames(styles['pho-album-list'], styles['pho-album-list--thumbnails'], styles['pho-album-list--selectable'])}>
    {props.albums.entries.map((a) => <AlbumItem album={a} key={a._id} onServerError={props.onServerError} onClick={props.onSubmitSelectedAlbum} />)}
  </div>
)

const AlbumsList = withEmpty(props => props.albums.entries.length === 0, 'albums', DumbAlbumsList)

const DumbAlbumsView = props => (
  <div>
    <AlbumsList {...props} />
  </div>
)

const ErrorAlbumsView = withError(props => props.error, 'albums', DumbAlbumsView)

export class AlbumsView extends Component {
  componentWillMount () {
    this.props.fetchAlbums()
  }

  render () {
    if (!this.props.albums) {
      return null
    }
    const { fetchingStatus } = this.props.albums
    const isFetching = fetchingStatus === 'pending' || fetchingStatus === 'loading'
    const error = fetchingStatus === 'failed'
    return isFetching
      ? <Loading loadingType='albums_fetching' />
      : <ErrorAlbumsView error={error} onServerError={() => this.handleError(error)} {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  albums: getAlbumsList(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAlbums: () => dispatch(fetchAlbums())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumsView)
