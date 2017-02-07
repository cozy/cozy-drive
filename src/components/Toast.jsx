import React, { Component } from 'react'

import styles from '../styles/toast.styl'
import classNames from 'classnames'

export default class extends Component {
  componentDidMount () {
    setTimeout(
      () => this.props.hideToast(),
      this.props.duration
    )
  }

  render ({ message, criticity = 'critical' }) {
    return (
      <div className={classNames(styles['toast'], styles[`toast--${criticity}`])}>
        <p>{message}</p>
      </div>
    )
  }
}
