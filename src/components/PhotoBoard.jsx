import styles from '../styles/photoList'

import React from 'react'
import { translate } from '../lib/I18n'

import Empty from './Empty'
import SelectionBar from '../containers/SelectionBar'
import PhotoList from './PhotoList'

export const PhotoBoard = props => {
  const { photoLists, showSelection, selected, onPhotoToggle } = props
  return (
    <div
      role='contentinfo'
      className={showSelection ? styles['pho-list-selection'] : ''}
    >
      {showSelection && <SelectionBar />}
      {photoLists.map(photoList => {
        return (<PhotoList
          key={photoList.title}
          title={photoList.title}
          photos={photoList.photos}
          selected={selected}
          onPhotoToggle={onPhotoToggle}
        />)
      })}
      {photoLists.length === 0 && <Empty emptyType='photos' />}
    </div>
  )
}

export default translate()(PhotoBoard)
