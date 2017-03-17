import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from '../lib/I18n'
import { indexFilesByDate } from '../actions/mango'
import { fetchPhotos } from '../actions/photos'
import { getPhotosByMonth } from '../reducers'

import PhotoBoard from './PhotoBoard'
import Topbar from '../components/Topbar'
const formatMonths = (photoList, f, format) => {
  return {
    title: f(photoList.title, format),
    photos: photoList.photos
  }
}

export class Timeline extends Component {
  constructor (props) {
    super(props)
    this.state = {
      photosAreDirty: false
    }
  }

  componentWillUpdate (nextProps, nextState) {
    this.state.photosAreDirty = nextProps.photos &&
      nextProps.photos.length !== this.props.photos.length
  }

  render () {
    const { f, photos, isFirstFetch, onFetchPhotoLists } = this.props
    const { photosAreDirty } = this.state
    return (
      <div>
        <Topbar viewName='photos' />
        <PhotoBoard
          fetchPhotoLists={() => onFetchPhotoLists(isFirstFetch, photos, f)}
          refetch={photosAreDirty}
          photosContext='timeline'
        />
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  photos: state.photos,
  isFirstFetch: state.timeline.isFirstFetch
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchPhotoLists: (isFirstFetch, photos, f) => {
    const fetchPhotoLists = isFirstFetch
      ? dispatch(indexFilesByDate())
          .then(mangoIndexByDate => dispatch(fetchPhotos(mangoIndexByDate)))
        : Promise.resolve(photos)

    return fetchPhotoLists.then(photos => {
      return getPhotosByMonth({ photos })
        .map(photoList => formatMonths(photoList, f, 'MMMM YYYY'))
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(Timeline))
