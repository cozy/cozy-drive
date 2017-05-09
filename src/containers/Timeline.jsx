import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from '../lib/I18n'
import { fetchPhotosByDate } from '../actions/photos'
import { getPhotosByMonth } from '../lib/helpers'

import PhotoBoard from './PhotoBoard'
import Topbar from '../components/Topbar'

const formatMonths = (photoList, f, format) => {
  return {
    title: f(photoList.title, format),
    photos: photoList.photos
  }
}

export class Timeline extends Component {
  componentWillMount () {
    this.props.fetchPhotoLists()
  }

  render () {
    const { photoLists, photoCount, fetchMore } = this.props
    return (
      <div>
        <Topbar viewName='photos' />
        <PhotoBoard
          photoLists={photoLists}
          photosContext='timeline'
          onFetchMore={() => fetchMore(photoCount)}
        />
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  photoCount: state.photos.length,
  photoLists: getPhotosByMonth(state.photos)
    .map(photoList => formatMonths(photoList, ownProps.f, 'MMMM YYYY'))
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchPhotoLists: () => dispatch(fetchPhotosByDate()),
  fetchMore: skip => dispatch(fetchPhotosByDate(skip))
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline))
