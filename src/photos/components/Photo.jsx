import styles from '../styles/photoList.styl'

import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import FileImageLoader from 'cozy-ui/transpiled/react/FileImageLoader'

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
  const { photo, box, selected = false, onToggle } = props
  const style = getStyleFromBox(box)
  // TODO : add back query to link
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
            e.stopPropagation()
            onToggle(photo, selected)
          }}
        >
          <input type="checkbox" checked={selected} onChange={() => {}} />
          <label />
        </span>

        <Link to={photo.id}>
          <FileImageLoader
            file={photo}
            linkType="small"
            render={src => (
              <img
                data-testid="pho-photo-item"
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

export default Photo
