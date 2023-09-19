import React, { Component } from 'react'
import justifiedLayout from 'justified-layout'
import classNames from 'classnames'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '../styles/photoList.styl'
import Photo from './Photo'

const photoDimensionsFallback = { width: 1, height: 1 }

// Returns pseudo responsive row height based on container width. Trying to get
// something between 190 and 240.
const adaptRowHeight = containerWidth => 180 + (containerWidth || 1800) / 30

// Some photos use EXIF orientation tags, and their width/height are thus incorrect
// if we don't take into account this orientation
const handlePhotoOrientation = metadata => {
  if (metadata.orientation && metadata.orientation > 4) {
    return { width: metadata.height, height: metadata.width }
  }
  return metadata
}

export class PhotoList extends Component {
  isPhotoSelected(photo, selected) {
    const selectedIds = selected.map(p => p._id)
    return selectedIds.indexOf(photo._id) !== -1
  }

  render() {
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
        return metadata && metadata.width && metadata.height
          ? handlePhotoOrientation(metadata)
          : photoDimensionsFallback
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

    const selectedIds = selected.map(p => p._id)
    const allSelected = photos.every(p => selectedIds.indexOf(p._id) !== -1)
    // we need to process the right position of the last photo of the first row so that we can align
    // the SELECT ALL button with the photo
    const firstRowTop = layout.boxes[0].top
    const secondRowFirstIndex = layout.boxes.findIndex(
      b => b.top !== firstRowTop
    )
    const firstRowLastBox =
      secondRowFirstIndex === -1
        ? layout.boxes[layout.boxes.length - 1]
        : layout.boxes[secondRowFirstIndex - 1]
    const firstRowLastBoxRight =
      containerWidth -
      firstRowLastBox.left -
      firstRowLastBox.width -
      conf.padding

    return (
      <div
        data-testid="photo-section"
        className={classNames(
          styles['pho-section'],
          showSelection && styles['pho-section--has-selection']
        )}
        key={key}
        style={{
          width: `${containerWidth}px`
        }}
      >
        <div className={styles['pho-section-header']}>
          <h3>{title}</h3>
          {showSelection && photos.length > 1 && allSelected && (
            <a
              style={{ marginRight: `${firstRowLastBoxRight}px` }}
              onClick={() => onPhotosUnselect(photos)}
            >
              {t('Board.unselect_all')}
            </a>
          )}
          {showSelection && photos.length > 1 && !allSelected && (
            <a
              style={{ marginRight: `${firstRowLastBoxRight}px` }}
              onClick={() => onPhotosSelect(photos)}
            >
              {t('Board.select_all')}
            </a>
          )}
        </div>
        <div
          className={styles['pho-photo-wrapper']}
          // Specify the width & height for making justified layout work.
          style={{
            width: `${containerWidth}px`,
            height: `${layout.containerHeight}px`
          }}
        >
          {photos.map((photo, index) => (
            <Photo
              photo={photo}
              box={layout.boxes[index]}
              key={photo.id + index}
              selected={this.isPhotoSelected(photo, selected)}
              onToggle={onPhotoToggle}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default translate()(PhotoList)
