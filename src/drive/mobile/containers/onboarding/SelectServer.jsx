import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'

import { registerDevice, setUrl } from '../../actions/settings'
import styles from '../../styles/onboarding'

export class SelectServer extends Component {
  state = {
    fetching: false
  }

  async setServerUrl(serverUrl) {
    this.setState({ fetching: true })
    try {
      await this.props.registerDevice(serverUrl, this.context.client)
      this.props.nextStep()
    } catch (e) {
      console.error(e)
    } finally {
      this.setState({ fetching: false })
    }
  }

  componentDidMount() {
    this.serverInput.focus()
  }

  componentDidUpdate() {
    if (this.props.error) {
      this.serverInput.focus()
      this.serverInput.select()
    }
  }

  render() {
    const { t, goBack, updateServerUrl, serverUrl, error } = this.props
    const { fetching } = this.state
    return (
      <div className={classNames(styles['wizard'], styles['select-server'])}>
        <header className={styles['wizard-header']}>
          <a className={styles['close-button']} onClick={goBack} />
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
            type="url"
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
            onChange={updateServerUrl}
            value={serverUrl}
          />
          {!error && (
            <p className={classNames(styles['description'], styles['info'])}>
              {t('mobile.onboarding.server_selection.description')}
            </p>
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
            onClick={() => this.setServerUrl(serverUrl)}
            disabled={error || !serverUrl}
            aria-busy={fetching}
          >
            {t('mobile.onboarding.server_selection.button')}
          </button>
        </footer>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  goBack: () => {
    ownProps.previousStep()
  },
  registerDevice: (serverUrl, client) => {
    if (!serverUrl) return Promise.reject(new Error('serverUrl is undefined'))
    return dispatch(registerDevice(client))
  },
  updateServerUrl: e => {
    const serverUrl = e.target.value
    dispatch(setUrl(serverUrl))
  }
})

const mapStateToProps = state => {
  return {
    serverUrl: state.mobile.settings.serverUrl,
    error: state.mobile.settings.error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(SelectServer)
)
