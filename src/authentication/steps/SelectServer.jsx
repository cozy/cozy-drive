/* global __ALLOW_HTTP__ */
import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'

import styles from '../styles'

const ERR_WRONG_ADDRESS = 'mobile.onboarding.server_selection.wrong_address'
const ERR_EMAIL = 'mobile.onboarding.server_selection.wrong_address_with_email'
const ERR_V2 = 'mobile.onboarding.server_selection.wrong_address_v2'
const ERR_COSY = 'mobile.onboarding.server_selection.wrong_address_cosy'

export class SelectServer extends Component {
  state = {
    value: '',
    fetching: false,
    error: null
  }

  componentDidMount() {
    this.serverInput.focus()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      error: nextProps.externalError ? ERR_WRONG_ADDRESS : null,
      fetching: nextProps.fetching
    })
  }

  componentDidUpdate() {
    if (this.state.error) {
      this.serverInput.focus()
      this.serverInput.select()
    }
  }

  validateValue(e) {
    this.setState({ value: e.target.value, error: null })
  }

  onSubmit = async e => {
    e.preventDefault()
    if (!this.state.value) return

    let url = this.state.value

    if (url.indexOf('@') > -1) {
      this.setState({ error: ERR_EMAIL })
      return
    }

    // prepend the protocol if ommited
    if (/^http(s)?:\/\//.test(url) === false) url = 'https://' + url

    let parsedURL
    try {
      parsedURL = new URL(url)

      if (parsedURL.protocol === 'http:' && !__ALLOW_HTTP__) {
        this.setState({ error: ERR_WRONG_ADDRESS })
        console.warn('Only https protocol is allowed')
        return
      }

      if (/\..*cosy.*\..+$/.test(parsedURL.host)) {
        // if the hostname contains "cosy" in the part before the TLD
        this.setState({ error: ERR_COSY })
        return
      }
    } catch (e) {
      this.setState({ error: ERR_WRONG_ADDRESS })
      return
    }

    this.setState({ fetching: true })

    let isV2Instance
    const cozyClient = this.context.client
    try {
      isV2Instance = await cozyClient.isV2(url)
    } catch (err) {
      // this can happen if the HTTP request to check the instance version fails; in that case, it is likely to fail again and be caught during the authorize process, which is designed to handle this
      isV2Instance = false
    }

    if (isV2Instance) {
      this.setState({
        error: ERR_V2,
        fetching: false
      })
      return
    }

    this.props.nextStep(url)
  }

  render() {
    const { value, error, fetching } = this.state
    const { t, previousStep } = this.props
    return (
      <form
        className={classNames(styles['wizard'], styles['select-server'])}
        onSubmit={this.onSubmit}
      >
        <header className={styles['wizard-header']}>
          <a
            className={classNames(styles['button-previous'], styles['--cross'])}
            onClick={previousStep}
          />
        </header>
        <div className={styles['wizard-main']}>
          <div
            className={
              error
                ? classNames(styles['logo-wrapper'], styles['error'])
                : styles['logo-wrapper']
            }
          >
            <div className={styles['cozy-logo-white']} />
          </div>
          <label className={styles['coz-form-label']}>
            {t('mobile.onboarding.server_selection.label')}
          </label>
          <input
            type="text"
            autoCapitalize="none"
            className={
              error
                ? classNames(styles['input'], styles['error'])
                : styles['input']
            }
            placeholder={t(
              'mobile.onboarding.server_selection.cozy_address_placeholder'
            )}
            ref={input => {
              this.serverInput = input
            }}
            onChange={this.validateValue.bind(this)}
            value={value}
          />
          {!error && (
            <ReactMarkdown
              className={classNames(styles['description'], styles['info'])}
              source={t('mobile.onboarding.server_selection.description')}
            />
          )}
          {error && (
            <ReactMarkdown
              className={classNames(styles['description'], styles['error'])}
              source={t(error)}
            />
          )}
        </div>
        <footer className={styles['wizard-footer']}>
          <button
            role="button"
            className={classNames(styles['c-btn'], styles['c-btn--regular'])}
            disabled={error || !value || fetching}
            aria-busy={fetching}
          >
            {t('mobile.onboarding.server_selection.button')}
          </button>
        </footer>
      </form>
    )
  }
}

export default translate()(SelectServer)
