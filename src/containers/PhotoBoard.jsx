import styles from '../styles/photoList'

import React, { Component } from 'react'
import { translate } from '../lib/I18n'

import Empty from '../components/Empty'
import SelectionBar from './SelectionBar'
import PhotoList from '../components/PhotoList'

export class PhotoBoard extends Component {
  render () {
    const { photoLists, showSelection, selected, onPhotoToggle } = this.props
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
}

export default translate()(PhotoBoard)
