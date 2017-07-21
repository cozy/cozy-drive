import React, { Component } from 'react'
import { cozyConnect } from '../lib/redux-cozy-client'
import styles from '../styles/layout'

import { Toolbar as TimelineToolbar, fetchTimeline, getPhotosByMonth } from '../ducks/timeline'

import BoardView from './BoardView'
import Topbar from '../components/Topbar'

export class Timeline extends Component {
  render () {
    const { f, photos } = this.props
    if (!photos) {
      return null
    }
    const photoLists = photos.data ? getPhotosByMonth(photos.data, f, 'MMMM YYYY') : []
    return (
      <div className={styles['pho-content-wrapper']}>
        <Topbar viewName='photos'>
          <TimelineToolbar />
        </Topbar>
        <BoardView
          photos={photos}
          photoLists={photoLists}
          photosContext='timeline'
        />
        {this.renderViewer(this.props.children)}
      </div>
    )
  }

  renderViewer (children) {
    if (!children) return null
    return React.Children.map(children, child => React.cloneElement(child, {
      photos: this.props.photos.data
    }))
  }
}

const mapDocumentsToProps = (ownProps) => ({ photos: fetchTimeline() })

export default cozyConnect(mapDocumentsToProps)(Timeline)
