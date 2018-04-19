import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'

import styles from './styles.styl'

const ALERT_SHOW = 'ALERT_SHOW'
const ALERT_DISMISS = 'ALERT_DISMISS'
const ALERT_CLEAR = 'ALERT_CLEAR'

const DEFAULT_AUTOCLOSE_DELAY = 3500
const DEFAULT_ALERT_LEVEL = 'info'
const DISMISS_DELAY = 500

const reducer = (state = [], action) => {
  if (action.alert) {
    if (!action.alert.id) {
      action.alert.id = new Date().getTime()
    }
    return [action.alert, ...state]
  }
  switch (action.type) {
    case ALERT_SHOW:
      return [action.alert, ...state.filter(a => a.id !== action.id)]
    case ALERT_DISMISS:
      return state.filter(a => a.id !== action.id)
    case ALERT_CLEAR:
      return []
    default:
      return state
  }
}

export default reducer

// Action creators
export const alertShow = (
  message,
  messageData = null,
  level = DEFAULT_ALERT_LEVEL
) => ({
  type: ALERT_SHOW,
  id: new Date().getTime(),
  message,
  messageData,
  level
})

export const alertDismiss = id => ({
  type: ALERT_DISMISS,
  id
})

export const alertClear = () => ({
  type: ALERT_CLEAR
})

// Dumb component that wraps the alerts
const Wrapper = ({ t, alerts, dismiss }) => (
  <div className={styles['coz-alerter']}>
    {alerts.map(alert => (
      <Alert
        id={alert.id}
        message={t(alert.message, alert.messageData)}
        level={alert.level || DEFAULT_ALERT_LEVEL}
        buttonText={alert.buttonText}
        buttonAction={alert.buttonAction}
        onClose={dismiss}
      />
    ))}
  </div>
)

const mapStateToProps = state => ({
  alerts: state.alerts
})
const mapDispatchToProps = dispatch => ({
  dismiss: id => dispatch(alertDismiss(id))
})

// Connected & exported JSX component
export const Alerter = translate()(
  connect(mapStateToProps, mapDispatchToProps)(Wrapper)
)

// Handles the fade-in/fade-out effect of each indiviual alert
class Alert extends Component {
  constructor(props) {
    super()
    this.state = {
      hidden: true
    }
    this.shouldAutoClose = !props.buttonText
    this.closeTimer = null
    this.dismissTimer = null
  }

  componentDidMount() {
    if (this.shouldAutoClose) {
      const closeDelay = this.props.duration
        ? parseInt(this.props.duration, 10)
        : DEFAULT_AUTOCLOSE_DELAY

      this.closeTimer = setTimeout(() => {
        this.setState({ hidden: true })
        this.dismissTimer = setTimeout(() => {
          this.props.onClose(this.props.id)
        }, DISMISS_DELAY)
      }, closeDelay)
    }
    // Delay to trigger CSS transition after the first render.
    // Totally open for a better way to achieve this.
    setTimeout(() => {
      this.setState({ hidden: false })
    }, 20)
  }

  componentWillUnmount() {
    this.setState({ hidden: false })
    if (this.closeTimer) {
      clearTimeout(this.closeTimer)
    }
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer)
    }
  }

  render() {
    const { message, level, buttonText, buttonAction, type } = this.props
    const { hidden } = this.state
    return (
      <div
        className={classNames(
          styles['coz-alert'],
          styles[`coz-alert--${level}`],
          hidden ? styles['coz-alert--hidden'] : ''
        )}
      >
        <p>{message}</p>
        {buttonText && (
          <button
            onClick={buttonAction}
            className={classNames(
              styles['coz-btn'],
              styles[`coz-btn--alert-${type}`]
            )}
          >
            {buttonText}
          </button>
        )}
      </div>
    )
  }
}
