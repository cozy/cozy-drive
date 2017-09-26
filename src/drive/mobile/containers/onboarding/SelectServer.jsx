import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'

import { registerDevice, setUrl } from '../../actions/settings'
import styles from '../../styles/onboarding'

export class SelectServer extends Component {
  componentDidMount() {
    this.serverInput.focus()
  }

  render() {
    const {
      t,
      goBack,
      selectServer,
      updateServerUrl,
      serverUrl,
      error
    } = this.props
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
            <p className={styles['description']}>
              {t('mobile.onboarding.server_selection.description')}
            </p>
          )}
          {error && (
            <p className={styles['description']} style={{ color: 'red' }}>
              <ReactMarkdown source={t(error)} />
            </p>
          )}
        </div>
        <footer className={styles['wizard-footer']}>
          <button
            role="button"
            className={classNames(styles['c-btn'], styles['c-btn--regular'])}
            onClick={() => selectServer(serverUrl)}
            disabled={error || !serverUrl}
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
  selectServer: serverUrl => {
    if (!serverUrl) return
    dispatch(registerDevice())
      .then(() => {
        ownProps.nextStep()
      })
      .catch(err => console.error(err))
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
