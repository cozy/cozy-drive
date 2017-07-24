import React, { Component } from 'react'
import { cozyConnect } from '../lib/redux-cozy-client'
import styles from '../styles/layout'

import { AlbumsToolbar, fetchAlbums } from '../ducks/albums'
import { filterSharedByLinkDocuments, filterSharedWithMeDocuments } from '../ducks/sharing'

import AlbumsList from '../components/AlbumsList'
import Loading from '../components/Loading'
import ErrorComponent from '../components/ErrorComponent'
import Topbar from '../components/Topbar'

const Content = ({ list, sharedByMe, sharedWithMe }) => {
  const { fetchStatus, data } = list
  switch (fetchStatus) {
    case 'pending':
    case 'loading':
      return <Loading loadingType='albums_fetching' />
    case 'failed':
      return <ErrorComponent errorType='albums' />
    default:
      return <AlbumsList albums={data} sharedByMe={sharedByMe} sharedWithMe={sharedWithMe} />
  }
}

export class AlbumsView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sharedByMe: [],
      sharedWithMe: []
    }
  }

  componentWillReceiveProps (newProps) {
    // TODO: this is not the cleanest way of doing this...
    if (newProps.albums && newProps.albums.data !== 0) {
      Promise.all([
        filterSharedByLinkDocuments(newProps.albums.data.map(a => a.id), 'io.cozy.photos.albums'),
        filterSharedWithMeDocuments(newProps.albums.data.map(a => a.id), 'io.cozy.photos.albums')
      ])
        .then(sharedIds => this.setState({ sharedByMe: sharedIds[0], sharedWithMe: sharedIds[1] }))
    }
  }

  render () {
    if (this.props.children) return this.props.children
    if (!this.props.albums) {
      return null
    }
    return (
      <div className={styles['pho-content-wrapper']}>
        <Topbar viewName='albums'>
          <AlbumsToolbar />
        </Topbar>
        <Content list={this.props.albums} sharedByMe={this.state.sharedByMe} sharedWithMe={this.state.sharedWithMe} />
      </div>
    )
  }
}

const mapDocumentsToProps = (ownProps) => ({ albums: fetchAlbums() })

export default cozyConnect(mapDocumentsToProps)(AlbumsView)
