import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  fetchAlbums,
  createAlbumMangoIndex }
from '../actions/albums'

import AlbumsList from '../components/AlbumsList'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import Topbar from '../components/Topbar'

export class AlbumsView extends Component {
  constructor (props) {
    super(props)
    this.state = {isFetching: true, error: false}

    this.onServerError = this.onServerError.bind(this)

    props.fetchAlbums()
      .then(() => { this.setState({isFetching: false, error: false}) })
      .catch(albumsError => {
        this.setState({isFetching: false, error: albumsError})
      })
  }

  onServerError (error) {
    this.setState({error})
  }

  render () {
    const { isFetching, error } = this.state
    if (isFetching) {
      return <Loading loadingType='albums_fetching' />
    }
    if (error) {
      return <ErrorComponent errorType='albums' />
    }
    return (
      !this.props.children
        ? <div>
          <Topbar viewName='albums' />
          <AlbumsList
            {...this.props}
            onServerError={this.onServerError}
          />
        </div>
        : <div>{ this.props.children }</div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  albums: state.albums.albumsList
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
