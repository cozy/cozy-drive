import React, { Component } from 'react'
import justifiedLayout from 'justified-layout'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import styles from '../styles/photoList'
import Photo from './Photo'

const photoDimensionsFallback = {width: 1, height: 1}

// Returns pseudo responsive row height based on container width. Trying to get
// something between 190 and 240.
const adaptRowHeight = containerWidth => 180 + ((containerWidth || 1800) / 30)

export class PhotoList extends Component {
  render () {
    const {
      t,
      key,
      title,
      photos,
      selected,
      showSelection,
      onPhotoToggle,
      onPhotosSelect,
      onPhotosUnselect,
      containerWidth
    } = this.props
    // containerWidth = 0 on the first render, skip it
    if (!containerWidth) {
      return null
    }
    const confDesk = {
      spacing: 16,
      padding: 32
    }
    const confMob = {
      spacing: 8,
      padding: 0
    }
    let conf = containerWidth >= 768 ? confDesk : confMob
    // @see https://flickr.github.io/justified-layout/
    const layout = justifiedLayout(
      photos.map(photo => {
        const metadata = photo.metadata || photo.attributes.metadata
        return metadata && metadata.width && metadata.height ? metadata : photoDimensionsFallback
      }),
      {
        containerWidth,
        targetRowHeight: adaptRowHeight(containerWidth),
        // Must be relevant with styles
        boxSpacing: {
          horizontal: conf.spacing,
          vertical: conf.spacing
        },
        containerPadding: {
          top: 0,
          right: conf.padding,
          bottom: 0,
          left: conf.padding
        }
      }
    )

    const photoIds = photos.map(p => p.id)
    const allSelected = selected.length === photoIds.length && selected.every(id => photoIds.indexOf(id) !== -1)
    // we need to process the right position of the last photo of the first row so that we can align
    // the SELECT ALL button with the photo
    const firstRowTop = layout.boxes[0].top
    const secondRowFirstIndex = layout.boxes.findIndex(b => b.top !== firstRowTop)
    const firstRowLastBox = secondRowFirstIndex === -1
      ? layout.boxes[layout.boxes.length - 1]
      : layout.boxes[secondRowFirstIndex - 1]
    const firstRowLastBoxRight = containerWidth - firstRowLastBox.left - firstRowLastBox.width - conf.padding

    return (
      <div
        className={classNames(styles['pho-section'], showSelection && styles['pho-section--has-selection'])}
        key={key}
        style={`width:${containerWidth}px;`}
        >
        <div className={styles['pho-section-header']}>
          <h3>{title}</h3>
          {showSelection && allSelected &&
            <a style={{ marginRight: `${firstRowLastBoxRight}px` }} onClick={() => onPhotosUnselect(photoIds)}>
              {t('Board.unselect_all')}
            </a>}
          {showSelection && !allSelected &&
            <a style={{ marginRight: `${firstRowLastBoxRight}px` }} onClick={() => onPhotosSelect(photoIds)}>
              {t('Board.select_all')}
            </a>}
        </div>
        <div className={styles['pho-photo-wrapper']}
          // Specify the width & height for making justified layout work.
          style={`width:${containerWidth}px; height:${layout.containerHeight}px;`}
          >
          {photos.map((photo, index) =>
            <Photo
              photo={photo}
              box={layout.boxes[index]}
              key={photo.id}
              selected={selected.indexOf(photo.id) !== -1}
              onToggle={onPhotoToggle}
            />
          )}
        </div>
      </div>
    )
  }
}

export default translate()(PhotoList)
