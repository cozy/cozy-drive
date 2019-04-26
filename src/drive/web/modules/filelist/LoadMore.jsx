import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Button, Spinner } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import styles from 'drive/styles/filelist.styl'

const LoadMore = ({ onClick, isLoading, text }) => (
  <div
    className={classnames(
      styles['fil-content-row'],
      styles['fil-content-row--center']
    )}
  >
    <Button
      theme="secondary"
      onClick={onClick}
      label={isLoading ? <Spinner noMargin /> : text}
    />
  </div>
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
// eslint-disable-next-line
const withTranslation = BaseComponent => ({ t, ...props }) => (
  <BaseComponent text={t('table.load_more')} {...props} />
)

export default translate()(withTranslation(LoadMore))
