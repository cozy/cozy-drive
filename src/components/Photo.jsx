import styles from '../styles/photoList'

import React, { Component } from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'

import { getThumbnailUrl } from '../actions/photos'

const getStyleFromBox = box => {
  let style = {}
  if (box) {
    if (box.width) {
      style.width = `${box.width}px`
    }
    if (box.height) {
      style.height = `${box.height}px`
    }
  }
  return style
}

export class Photo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      isImageLoading: true
    }

    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.fetchPhoto = this.fetchPhoto.bind(this)

    this.fetchPhoto(props.photo._id)
  }

  fetchPhoto (photoId) {
    getThumbnailUrl(photoId)
      .then(url => this.setState({
        url,
        loading: false
      }))
  }

  handleImageLoaded () {
    this.setState({ isImageLoading: false })
  }

  render () {
    const { photo, box, selected = false, onToggle, router } = this.props
    const { loading, url, isImageLoading } = this.state
    const parentPath = router.location.pathname
    return (
      <div
        className={classNames(
          styles['pho-photo'],
          { [styles['pho-photo--selected']]: selected }
        )}
        style={getStyleFromBox(box)}
      >
        { !loading &&
          <div>
            <span
              className={styles['pho-photo-select']}
              data-input='checkbox'
              onClick={e => {
                e.stopImmediatePropagation()
                onToggle(photo._id, selected)
              }}>
              <input
                type='checkbox'
                checked={selected}
               />
              <label />
            </span>
            <Link to={`${parentPath}/${photo._id}`}>
              <img
                className={styles['pho-photo-item']}
                onLoad={this.handleImageLoaded}
                style={Object.assign(
                  getStyleFromBox(box),
                  isImageLoading ? {display: 'none'} : {})
                }
                alt={photo.name}
                src={url}
              />
            </Link>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(Photo)
