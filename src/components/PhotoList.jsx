import styles from '../styles/photoList'
import React, { Component } from 'react'
import justifiedLayout from 'justified-layout'
import Photo from './Photo'
import classNames from 'classnames'

const photoDimensionsFallback = {width: 1, height: 1}

// Returns pseudo responsive row height based on container width. Trying to get
// something between 190 and 240.
const adaptRowHeight = containerWidth => 180 + ((containerWidth || 1800) / 30)

export class PhotoList extends Component {
  render () {
    const { key, title, photos, selected, onPhotoToggle, containerWidth } = this.props
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
        containerWidth: containerWidth,
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
    return (
      <div
        className={classNames(styles['pho-section'], selected.length && styles['pho-section--has-selection'])}
        key={key}
        style={`width:${containerWidth}px;`}
        >
        {!!title && <h3>{title}</h3>}
        <div className={styles['pho-photo-wrapper']}
          // Specify the width & height for making justified layout work.
          style={`width:${containerWidth}px; height:${layout.containerHeight}px;`}
          >
          {photos.map((photo, index) =>
            <Photo
              photo={photo}
              box={layout.boxes[index]}
              key={photo._id}
              selected={selected.indexOf(photo._id) !== -1}
              onToggle={onPhotoToggle}
              />
          )}
        </div>
      </div>
    )
  }
}

export default PhotoList
