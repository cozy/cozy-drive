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
    props.fetchAlbums()
      .then(() => { this.setState({isFetching: false, error: false}) })
      .catch(albumsError => {
        console.error(albumsError)
        this.setState({isFetching: false, error: true})
      })
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
      <div>
        <Topbar viewName='albums' />
        <AlbumsList {...this.props} {...this.state} />
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  albums: state.albums
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
