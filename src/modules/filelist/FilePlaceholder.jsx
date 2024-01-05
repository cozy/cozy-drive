import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { TableRow, TableCell } from 'cozy-ui/transpiled/react/Table'

import styles from 'styles/filelist.styl'

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

const FilePlaceholder = ({ index, breakpoints: { isMobile } }) => (
  <TableRow className={styles['fil-content-row']}>
    <TableCell
      className={cx(
        styles['fil-content-cell'],
        styles['fil-content-file-select']
      )}
    />
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-file-thumbnail'], {
        'u-pl-0': !isMobile
      })}
    >
      <PlaceholderBlock width="2rem" />
    </TableCell>
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-file'])}
    >
      <PlaceholderBlock width={`${seededRandomBetween(3, 12, index)}rem`} />
    </TableCell>
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-date'])}
    >
      <PlaceholderBlock width="5rem" />
    </TableCell>
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-size'])}
    >
      <PlaceholderBlock width={`${seededRandomBetween(3.75, 5, index)}rem`} />
    </TableCell>
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-status'])}
    >
      <PlaceholderBlock width="1.25rem" />
    </TableCell>
  </TableRow>
)

FilePlaceholder.propTypes = {
  index: PropTypes.number
}

FilePlaceholder.defaultProps = {
  index: 1
}

export default withBreakpoints()(FilePlaceholder)
