import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchPhotos } from '../actions/photos'

import PhotosList from '../components/PhotosList'
import Topbar from '../components/Topbar'
import Viewer from '../components/Viewer'

export class Timeline extends Component {
  constructor (props) {
    super(props)
    this.state = { isFirstFetch: true }
  }

  componentWillReceiveProps (nextProps) {
    /* istanbul ignore else */
    if (!nextProps.isIndexing && this.state.isFirstFetch) {
      this.props.onFirstFetch(nextProps.mangoIndexByDate)
      this.setState({ isFirstFetch: false })
    }
  }

  render () {
    return (
      <div>
        <Topbar viewName='photos' />
        <PhotosList {...this.props} {...this.state} />
        {this.props && this.props.params && this.props.params.photoId &&
          <Viewer photoId={this.props.params.photoId} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  isIndexing: state.ui.isIndexing,
  isWorking: state.ui.isWorking,
  photos: state.photos,
  mangoIndexByDate: state.mangoIndexByDate
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onFirstFetch: (mangoIndexByDate) => {
    dispatch(fetchPhotos(mangoIndexByDate))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline)
