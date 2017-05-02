import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchAlbums, createAlbumMangoIndex, getAlbumsList } from '../ducks/albums'

import AlbumsList from '../components/AlbumsList'
import Loading from '../components/Loading'
import { withError } from '../components/ErrorComponent'
import Topbar from '../components/Topbar'

const DumbAlbumsView = props => (
  <div>
    <Topbar viewName='albums' />
    <AlbumsList
      {...props}
    />
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
    if (this.props.children) return this.props.children
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
