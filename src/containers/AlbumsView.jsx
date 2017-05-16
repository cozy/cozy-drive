import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchAlbums, getAlbumsList } from '../ducks/albums'

import AlbumsList from '../components/AlbumsList'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import Topbar from '../components/Topbar'

const Content = ({ list }) => {
  const { fetchStatus, entries } = list
  switch (fetchStatus) {
    case 'pending':
    case 'loading':
      return <Loading loadingType='albums_fetching' />
    case 'failed':
      return <ErrorComponent errorType='albums' />
    default:
      return <AlbumsList albums={entries} />
  }
}

export class AlbumsView extends Component {
  componentWillMount () {
    this.props.fetchAlbums()
  }

  render () {
    if (this.props.children) return this.props.children
    if (!this.props.albums) {
      return null
    }
    return (
      <div>
        <Topbar viewName='albums' />
        <Content list={this.props.albums} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  albums: getAlbumsList(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAlbums: (index) => dispatch(fetchAlbums(index))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumsView)
