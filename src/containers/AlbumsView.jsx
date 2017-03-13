import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  fetchAlbums,
  createAlbumMangoIndex }
from '../actions/albums'

import AlbumsList from '../components/AlbumsList'
import Loading from '../components/Loading'
import Topbar from '../components/Topbar'

export class AlbumsView extends Component {
  constructor (props) {
    super(props)
    this.state = { isFetching: true }
    props.fetchAlbums().then(
      () => { this.setState({ isFetching: false }) }
    )
  }

  render () {
    const { isFetching } = this.state
    if (isFetching) {
      return <Loading loadingType='albums_fetching' />
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
