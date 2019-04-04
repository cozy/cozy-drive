import styles from '../styles/photoList'

import React from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'

import { ImageLoader } from 'components/Image'

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
      data-test-item={photo.name}
      className={classNames(styles['pho-photo'], {
        [styles['pho-photo--selected']]: selected
      })}
    >
      <div>
        <span
          className={styles['pho-photo-select']}
          data-input="checkbox"
          onClick={e => {
            e.stopImmediatePropagation()
            onToggle(photo, selected)
          }}
        >
          <input type="checkbox" checked={selected} />
          <label />
        </span>
        <Link
          to={{
            pathname: `${router.location.pathname}/${photo.id}`,
            query: router.location.query
          }}
        >
          <ImageLoader
            file={photo}
            size="small"
            render={src => (
              <img
                data-test-id="pho-photo-item"
                src={src}
                className={styles['pho-photo-item']}
                style={style}
              />
            )}
          />
        </Link>
      </div>
    </div>
  )
}

export default withRouter(Photo)
