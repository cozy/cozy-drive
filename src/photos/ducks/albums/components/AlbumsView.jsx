import React from 'react'
import styles from '../../../styles/layout.styl'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import AlbumsToolbar from './AlbumsToolbar'
import AlbumsList from './AlbumsList'
import Loading from '../../../components/Loading'
import ErrorComponent from 'components/Error/ErrorComponent'
import Topbar from '../../../components/Topbar'

const Content = ({ list }) => {
  const { fetchStatus, lastFetch } = list
  if (!lastFetch && (fetchStatus === 'pending' || fetchStatus === 'loading')) {
    return <Loading loadingType="albums_fetching" />
  }
  if (fetchStatus === 'failed') {
    return <ErrorComponent errorType="albums" />
  }

  return <AlbumsList {...list} />
}

const AlbumsView = ({ albums }) => {
  if (!albums) {
    return null
  }
  return (
    <div
      data-testid="album-pho-content-wrapper"
      className={styles['pho-content-wrapper']}
    >
      <Topbar viewName="albums">
        <AlbumsToolbar />
      </Topbar>
      <Content list={albums} />
    </div>
  )
}

export default translate()(AlbumsView)
