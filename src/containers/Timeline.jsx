import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from '../styles/layout'

import { translate } from '../lib/I18n'
import { Toolbar as TimelineToolbar, fetchIfNeededPhotos, fetchMorePhotos, getTimelineList } from '../ducks/timeline'
import { getPhotosByMonth } from '../lib/helpers'

import BoardView from './BoardView'
import Topbar from '../components/Topbar'

const formatMonths = (photoList, f, format) => {
  return {
    title: f(photoList.title, format),
    photos: photoList.photos
  }
}

export class Timeline extends Component {
  componentWillMount () {
    this.props.fetchIfNeededPhotos()
  }

  render () {
    const { f, list, fetchMorePhotos } = this.props
    if (!list) {
      return null
    }

    const photoLists = getPhotosByMonth(list.entries)
      .map(photoList => formatMonths(photoList, f, 'MMMM YYYY'))

    return (
      <div className={styles['pho-content-wrapper']}>
        <Topbar viewName='photos'>
          <TimelineToolbar />
        </Topbar>
        <BoardView
          photoLists={photoLists}
          fetchStatus={list.fetchStatus}
          hasMore={list.hasMore}
          photosContext='timeline'
          onFetchMore={() => fetchMorePhotos(list.index, list.entries.length)}
        />
        {this.renderViewer(this.props.children)}
      </div>
    )
  }

  renderViewer (children) {
    if (!children) return null
    return React.Children.map(children, child => React.cloneElement(child, {
      photos: this.props.list.entries
    }))
  }
}

const mapStateToProps = (state, ownProps) => ({
  list: getTimelineList(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchIfNeededPhotos: () => dispatch(fetchIfNeededPhotos()),
  fetchMorePhotos: (index, skip) => dispatch(fetchMorePhotos(index, skip))
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline))
