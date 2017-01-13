import React, { Component } from 'react'
import { translate } from '../lib/I18n'

import styles from '../styles/alerter.styl'
import classNames from 'classnames'

class Alerter extends Component {

  constructor () {
    super()
    this.state = {
      hidden: true,
      reloadTimer: 10
    }
  }

  show () {
    this.setState({ hidden: false })
    this.runCountdown()
  }

  // Keep the reload timer running
  runCountdown () {
    setTimeout(this.countdown.bind(this), 1000)
  }

  // Update the reload timer
  countdown () {
    let { reloadTimer } = this.state
    reloadTimer--
    if (reloadTimer) {
      this.setState({ reloadTimer: reloadTimer })
      this.runCountdown()
    }
  }

  componentDidMount () {
    // Delay to trigger CSS transition. Totally open for a better way to
    // achieve this.
    setTimeout(() => {
      this.show()
    }, 10)
  }

  componentWillReceiveProps (newProps) {
    const { error, reload } = newProps
    const { reloadTimer } = this.state
    if (error && error.critical) {
      setTimeout(() =>
        (typeof reload === 'function') && reload()
      , reloadTimer * 1000)
    }
  }

  render ({t, error, reload}) {
    const { hidden, reloadTimer } = this.state
    return <div className={classNames(styles['fil-alerter'], hidden ? styles['coz-alerter--hidden'] : '')}>
      {error && error.critical &&
        <div className={styles['coz-overlay']} />
      }
      {error && error.message &&
        <div className={styles['coz-alerter']}>
          <div className={classNames(styles['coz-alert'], styles['coz-alert--error'])}>
            <p>{t(error.message)}</p>
            {error.critical &&
              <p>{t('alert.critical_will_reload', { smart_count: reloadTimer })}</p>
            }
            <a onClick={reload} className={classNames('coz-btn', 'coz-btn--alert-error')}>
              {t('alert.button.reload')}
            </a>
          </div>
        </div>
      }
    </div>
  }
}

export default translate()(Alerter)
