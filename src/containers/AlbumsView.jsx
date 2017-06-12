import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from '../styles/layout'

import { fetchAlbums, getAlbumsList } from '../ducks/albums'
import { filterSharedDocuments } from '../ducks/sharing'

import { ALBUM_DOCTYPE } from '../constants/config'

import AlbumsList from '../components/AlbumsList'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import Topbar from '../components/Topbar'

const Content = ({ list, shared }) => {
  const { fetchStatus, entries } = list
  switch (fetchStatus) {
    case 'pending':
    case 'loading':
      return <Loading loadingType='albums_fetching' />
    case 'failed':
      return <ErrorComponent errorType='albums' />
    default:
      return <AlbumsList albums={entries} shared={shared} />
  }
}

export class AlbumsView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shared: []
    }
  }

  componentWillMount () {
    this.props.fetchAlbums()
  }

  componentWillReceiveProps (newProps) {
    if (newProps.albums && newProps.albums.entries !== 0) {
      filterSharedDocuments(newProps.albums.entries.map(a => a._id), ALBUM_DOCTYPE)
        .then(ids => this.setState({ shared: ids }))
    }
  }

  render () {
    if (this.props.children) return this.props.children
    if (!this.props.albums) {
      return null
    }
    return (
      <div className={styles['pho-content-wrapper']}>
        <Topbar viewName='albums' />
        <Content list={this.props.albums} shared={this.state.shared} />
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
