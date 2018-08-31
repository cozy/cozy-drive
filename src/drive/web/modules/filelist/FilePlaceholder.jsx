import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import styles from 'drive/styles/filelist'

// using a seeded PRNG to prevent re-renders from changing the results
const seededRandom = seed => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}
const seededRandomBetween = (min, max, seed) =>
  min + seededRandom(seed) * (max - min)

const PlaceholderBlock = ({ width }) => (
  <div className={styles['fil-content-file-placeholder']} style={{ width }} />
)

PlaceholderBlock.propTypes = {
  width: PropTypes.string
}

PlaceholderBlock.defaultProps = {
  width: '100%'
}

const FilePlaceholder = ({ index }) => (
  <div className={styles['fil-content-row']}>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-file-select']
      )}
    />
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-file']
      )}
    >
      <PlaceholderBlock width={`${seededRandomBetween(3, 12, index)}rem`} />
    </div>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-date']
      )}
    >
      <PlaceholderBlock width="5rem" />
    </div>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-size']
      )}
    >
      <PlaceholderBlock width={`${seededRandomBetween(3.75, 5, index)}rem`} />
    </div>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-status']
      )}
    >
      <PlaceholderBlock width="1.25rem" />
    </div>
  </div>
)

FilePlaceholder.propTypes = {
  index: PropTypes.number
}

FilePlaceholder.defaultProps = {
  index: 1
}

export default FilePlaceholder
