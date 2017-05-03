import styles from '../styles/albumsList'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { withError } from '../components/ErrorComponent'
import { withEmpty } from '../components/Empty'

import Loading from '../components/Loading'
import SelectAlbumItem from '../components/SelectAlbumItem'

import { fetchAlbums, createAlbumMangoIndex, getAlbumsList } from '../ducks/albums'

const DumbAlbumsList = props => (
  <div className={classNames(styles['pho-album-list'], styles['pho-album-list--thumbnails'], styles['pho-album-list--selectable'])}>
    {props.albums.map((a) => <SelectAlbumItem album={a} key={a._id} onServerError={props.onServerError} onSelectAlbum={props.onSubmitSelectedAlbum} />)}
  </div>
)

const AlbumsList = withEmpty(props => props.albums.length === 0, 'albums', DumbAlbumsList)

const DumbAlbumsView = props => (
  <div>
    <AlbumsList {...props} />
  </div>
)

const ErrorAlbumsView = withError(props => props.error, 'albums', DumbAlbumsView)

export class AlbumsView extends Component {
  constructor (props) {
    super(props)
    this.state = {isFetching: true, error: false}
  }

  componentWillMount () {
    this.props.fetchAlbums()
      .then(() => {
        this.setState({isFetching: false, error: false})
      })
      .catch(albumsError => {
        this.setState({isFetching: false, error: albumsError})
      })
  }

  handleError (error) {
    this.setState({error})
  }

  render () {
    const { isFetching, error } = this.state
    return isFetching
      ? <Loading loadingType='albums_fetching' />
      : <ErrorAlbumsView error={error} onServerError={() => this.handleError(error)} {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  albums: getAlbumsList(state.albums)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAlbums: () => {
    return dispatch(createAlbumMangoIndex()).then(
      albumsIndexByName => {
        return dispatch(fetchAlbums(albumsIndexByName))
      }
    )
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumsView)
