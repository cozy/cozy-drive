import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchPhotos } from '../actions/photos'
import { togglePhotoSelection } from '../actions/selection'
import { getPhotosByMonth, mustShowSelectionBar } from '../reducers'

import PhotosList from '../components/PhotosList'
import Topbar from '../components/Topbar'

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
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  isIndexing: state.ui.isIndexing,
  isWorking: state.ui.isWorking,
  selected: state.ui.selected,
  showSelection: mustShowSelectionBar(state),
  photosByMonth: getPhotosByMonth(state),
  mangoIndexByDate: state.mangoIndexByDate
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onFirstFetch: (mangoIndexByDate) => {
    dispatch(fetchPhotos(mangoIndexByDate))
  },
  onPhotoToggle: (id, selected) => {
    dispatch(togglePhotoSelection(id, selected))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline)
