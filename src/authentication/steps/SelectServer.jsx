/* global __ALLOW_HTTP__ */
import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'
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
    this.input.focus()
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      ...state,
      error: nextProps.externalError ? ERR_WRONG_ADDRESS : null,
      fetching: nextProps.fetching
    }))
  }

  componentDidUpdate() {
    if (this.state.error) {
      this.input.focus()
      this.input.select()
    }
  }

  onChange(value) {
    if (this.state.error) {
      this.setState(state => ({ ...state, error: null }))
    }
    this.setState(state => ({ ...state, value: value.trim() }))
  }

  onSubmit = async e => {
    e.preventDefault()
    const value = this.state.value
    let error

    if (this.hasAtSign(value)) {
      error = ERR_EMAIL
    }
    if (this.hasMispelledCozy(value)) {
      error = ERR_COSY
    }

    const url = this.getUrl(value)
    if (
      !(url instanceof URL) ||
      (url.protocol === 'http:' && !__ALLOW_HTTP__)
    ) {
      error = ERR_WRONG_ADDRESS
    }
    if (error) {
      this.setState(state => ({ ...state, error }))
      this.props.onException(new Error(error), {
        tentativeUrl: value,
        onboardingStep: 'validating URL'
      })
      return false
    }

    this.setState(state => ({ ...state, fetching: true }))

    if (await this.isV2URL(value)) {
      this.setState(state => ({
        ...state,
        error: ERR_V2,
        fetching: false
      }))
    }
    this.props.nextStep(value)
  }

  isV2URL = async url => {
    try {
      return await this.context.client.isV2(url)
    } catch (err) {
      this.props.onException(err, {
        tentativeUrl: url,
        onboardingStep: 'checking is V2 URL'
      })
      // this can happen if the HTTP request to check the instance version fails; in that case, it is likely to fail again and be caught during the authorize process, which is designedto handle this
      return false
    }
  }

  hasMispelledCozy = value => /\..*cosy.*\./.test(value)
  hasAtSign = value => /.*@.*/.test(value)

  getUrl = value => {
    try {
      return new URL(/^http(s)?:\/\//.test(value) ? value : `https://${value}`)
    } catch (err) {
      this.setState(state => ({ ...state, error: ERR_WRONG_ADDRESS }))
      this.props.onException(err, {
        tentativeUrl: value,
        onboardingStep: 'checking URL'
      })
    }
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
            className={classNames(styles['logo-wrapper'], {
              [styles['error']]: error
            })}
          >
            <div className={styles['cozy-logo-white']} />
          </div>
          <label className={styles['coz-form-label']}>
            {t('mobile.onboarding.server_selection.label')}
          </label>
          <input
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            className={classNames(styles['input'], {
              [styles['error']]: error
            })}
            placeholder={t(
              'mobile.onboarding.server_selection.cozy_address_placeholder'
            )}
            ref={input => {
              this.input = input
            }}
            onChange={({ target: { value } }) => {
              this.onChange(value)
            }}
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
          <Button disabled={error || !value || fetching} busy={fetching}>
            {t('mobile.onboarding.server_selection.button')}
          </Button>
        </footer>
      </form>
    )
  }
}

SelectServer.propTypes = {
  t: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  externalError: PropTypes.object,
  onException: PropTypes.func.isRequired
}

SelectServer.defaultProps = {
  fetching: false,
  externalError: null
}

export default translate()(SelectServer)
