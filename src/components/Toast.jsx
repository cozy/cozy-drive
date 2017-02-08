import React, { Component } from 'react'
import classNames from 'classnames'

import styles from '../styles/toast.styl'
import { translate } from '../lib/I18n'

export default translate()(class extends Component {
  componentDidMount () {
    setTimeout(
      () => this.props.hideToast(),
      this.props.duration
    )
  }

  render ({ t, message, criticity = 'critical' }) {
    return (
      <div className={classNames(styles['toast'], styles[`toast--${criticity}`])}>
        <p>{t(message)}</p>
      </div>
    )
  }
})
