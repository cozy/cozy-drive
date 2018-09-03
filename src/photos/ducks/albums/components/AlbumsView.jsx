import React, { Component } from 'react'
import styles from '../../../styles/layout'
import { translate } from 'cozy-ui/react/I18n'

import AlbumsToolbar from './AlbumsToolbar'
import AlbumsList from './AlbumsList'
import Loading from '../../../components/Loading'
import ErrorComponent from 'components/Error/ErrorComponent'
import Topbar from '../../../components/Topbar'

const Content = ({ list }) => {
  const { fetchStatus, data } = list
  switch (fetchStatus) {
    case 'pending':
    case 'loading':
      return <Loading loadingType="albums_fetching" />
    case 'failed':
      return <ErrorComponent errorType="albums" />
    default:
      return <AlbumsList albums={data} />
  }
}

class AlbumsView extends Component {
  render() {
    const { t } = this.props
    if (this.props.children) return this.props.children
    if (!this.props.albums) {
      return null
    }
    return (
      <div className={styles['pho-content-wrapper']}>
        <Topbar viewName="albums">
          <AlbumsToolbar t={t} />
        </Topbar>
        <Content list={this.props.albums} />
      </div>
    )
  }
}

export default translate()(AlbumsView)
