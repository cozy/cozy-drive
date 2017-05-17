/* global cozy */
import styles from '../styles/photoList'

import React, { Component } from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'

import { getPhotoLink } from '../actions/photos'

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
      isImageLoading: true,
      url: `${cozy.client._url}${props.photo.links.small}`,
      fallback: null
    }
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleImageError = this.handleImageError.bind(this)
  }

  handleImageLoaded () {
    this.setState({ isImageLoading: false })
  }

  handleImageError () {
    if (this.state.fallback && this.img.src === this.state.fallback) return
    // extreme fallback
    getPhotoLink(this.props.photo._id)
      .then(url => {
        this.img.src = url
        this.setState({ fallback: url })
      })
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
                ref={img => { this.img = img }}
                className={styles['pho-photo-item']}
                onLoad={this.handleImageLoaded}
                onError={this.handleImageError}
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
