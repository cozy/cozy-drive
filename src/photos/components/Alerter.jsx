import React, { Component } from 'react'

import styles from '../styles/alerter.styl'
import classNames from 'classnames'

const createStore = () => {
  let notifications = []
  let listeners = []

  const dispatch = (notification) => {
    notification.id = notifications.length
    notifications.push(notification)
    listeners.forEach(listener => listener(notification))
  }

  const subscribe = (listener) => {
    listeners.push(listener)
  }

  return { dispatch, subscribe }
}

const store = createStore()

class Alert extends Component {
  constructor () {
    super()
    this.state = {
      hidden: true
    }
  }

  componentDidMount () {
    this.close = this.close.bind(this)
    this.closeTimer = setTimeout(() => {
      this.beginClosing()
    }, 2000)
    // Delay to trigger CSS transition after the first render.
    // Totally open for a better way to achieve this.
    setTimeout(() => {
      this.setState({hidden: false})
    }, 20)
  }

  componentWillUnmount () {
    // this.base.removeEventListener('transitionend', this.close, false)
    this.setState({ hidden: false })
    if (this.closeTimer) {
      clearTimeout(this.closeTimer)
    }
  }

  beginClosing () {
    // this.base.addEventListener('transitionend', this.close, false)
    this.setState({ hidden: true })
  }

  close () {
    this.props.onClose()
  }

  render () {
    const { message, type, buttonText, buttonAction } = this.props
    const { hidden } = this.state
    return (
      <div className={styles['coz-alerter']}>
        <div
          className={classNames(
            styles['coz-alert'],
            styles[`coz-alert--${type}`],
            hidden ? styles['coz-alert--hidden'] : ''
          )}
        >
          <p>{message}</p>
          {buttonText &&
            <a onClick={buttonAction} className={classNames('coz-btn', `coz-btn--alert-${type}`)}>
              {buttonText}
            </a>
          }
        </div>
        {type === 'error' &&
          <div
            className={classNames(
              styles['coz-overlay'],
              hidden ? styles['coz-overlay--hidden'] : ''
            )}
          />
        }
      </div>
    )
  }
}

export default class Alerter extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      notifications: []
    }
  }

  static info (msg, options) {
    store.dispatch({ type: 'info', msg, options })
  }

  static success (msg, options) {
    store.dispatch({ type: 'success', msg, options })
  }

  static error (msg, options) {
    store.dispatch({ type: 'error', msg, options })
  }

  componentDidMount () {
    this.setState({mounted: true})
    store.subscribe(this.notify.bind(this))
  }

  notify (notification) {
    this.setState({
      notifications: [...this.state.notifications, notification]
    })
  }

  handleClose (id) {
    let idx = this.state.notifications.findIndex(n => n.id === id)
    this.setState({
      notifications: [
        ...this.state.notifications.slice(0, idx),
        ...this.state.notifications.slice(idx + 1)
      ]
    })
  }

  render () {
    const t = this.props.t
    return (
      <div className={styles['pho-alerter']}>
        {this.state.notifications.map(notif => (
          <Alert
            type={notif.type}
            key={notif.id}
            message={t ? t(notif.msg, notif.options) : notif.msg}
            onClose={this.handleClose.bind(this, notif.id)}
            buttonText={notif.options && notif.options.buttonText}
            buttonAction={notif.options && notif.options.buttonAction}
          />
        ))}
      </div>
    )
  }
}
