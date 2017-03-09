import styles from '../styles/photoList'

import React from 'react'
import { translate } from '../lib/I18n'

import Empty from './Empty'
import SelectionBar from '../containers/SelectionBar'
import PhotosList from './PhotosList'

export const PhotoBoard = props => {
  const { f, photosByMonth, showSelection, selected, onPhotoToggle } = props
  return (
    <div
      role='contentinfo'
      className={showSelection ? styles['pho-list-selection'] : ''}
    >
      {showSelection && <SelectionBar />}
      {Object.keys(photosByMonth).map(month => {
        return (<PhotosList
          key={f(month, 'MMMM YYYY')}
          title={f(month, 'MMMM YYYY')}
          photos={photosByMonth[month]}
          selected={selected}
          onPhotoToggle={onPhotoToggle}
        />)
      })}
      {Object.keys(photosByMonth).length === 0 && <Empty emptyType='photos' />}
    </div>
  )
}

export default translate()(PhotoBoard)
