import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Button, Spinner } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import styles from '../styles/table'

const LoadMore = ({ onClick, isLoading, text }) => (
  <div
    className={classnames(
      styles['fil-content-row'],
      styles['fil-content-row--center']
    )}
  >
    <Button theme="secondary" onClick={onClick}>
      {isLoading ? <Spinner noMargin /> : text}
    </Button>
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

const withTranslation = BaseComponent => ({ t, ...props }) => (
  <BaseComponent text={t('table.load_more')} {...props} />
)

export default translate()(withTranslation(LoadMore))
