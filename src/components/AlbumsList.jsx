import styles from '../styles/albumsList'

import React from 'react'

import Empty from '../components/Empty'
import AlbumItem from '../components/AlbumItem'

export const AlbumsList = ({ t, f, albums }) => {
  if (albums.length === 0) {
    return <Empty emptyType='albums' />
  } else {
    return (
      <div className={styles['pho-album-list']}>
        {albums.map((a) => <AlbumItem album={a} key={a._id} />)}
      </div>
    )
  }
}

export default AlbumsList
