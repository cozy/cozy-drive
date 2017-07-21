/* global cozy */
import styles from '../styles/photoList'

import React from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'

import ImageLoader from './ImageLoader'

const getStyleFromBox = box => {
  let style = {}
  if (box) {
    if (box.width) {
      style.width = `${box.width}px`
    }
    if (box.height) {
      style.height = `${box.height}px`
    }
    if (box.top) {
      style.top = `${box.top}px`
    }
    if (box.left) {
      style.left = `${box.left}px`
    }
  }
  return style
}

const Photo = props => {
  const { photo, box, selected = false, onToggle, router } = props
  const style = getStyleFromBox(box)
  return (
    <div
      style={style}
      className={classNames(
        styles['pho-photo'],
        { [styles['pho-photo--selected']]: selected }
      )}
    >
      <div>
        <span
          className={styles['pho-photo-select']}
          data-input='checkbox'
          onClick={e => {
            e.stopImmediatePropagation()
            onToggle({ id: photo.id }, selected)
          }}>
          <input
            type='checkbox'
            checked={selected}
           />
          <label />
        </span>
        <Link to={{
          pathname: `${router.location.pathname}/${photo.id}`,
          query: router.location.query
        }}>
          <ImageLoader
            photo={photo}
            className={styles['pho-photo-item']}
            style={style}
            src={`${cozy.client._url}${photo.links.small}`}
          />
        </Link>
      </div>
    </div>
  )
}

export default withRouter(Photo)
