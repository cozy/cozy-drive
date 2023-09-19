import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import { Button, Spinner } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import { TableRow } from 'cozy-ui/transpiled/react/Table'

import styles from 'drive/styles/filelist.styl'

const LoadMore = ({ onClick, isLoading, text }) => (
  <TableRow
    className={cx(styles['fil-content-row'], styles['fil-content-row--center'])}
  >
    <Button
      theme="secondary"
      onClick={onClick}
      label={isLoading ? <Spinner noMargin /> : text}
    />
  </TableRow>
)

LoadMore.propTypes = {
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  text: PropTypes.string.isRequired
}

LoadMore.defaultProps = {
  onClick: null,
  isLoading: false
}
const withTranslation =
  BaseComponent =>
  // eslint-disable-next-line
    ({ t, ...props }) =>
    <BaseComponent text={t('table.load_more')} {...props} />

export default translate()(withTranslation(LoadMore))
