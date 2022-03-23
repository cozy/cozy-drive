import React, { Component } from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { Button } from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import { logInfo } from 'drive/lib/reporter'
import appMetadata from 'drive/appMetadata'

import styles from '../styles.styl'

const FEEDBACK_EMAIL = 'contact@cozycloud.cc'

class FeedbackForm extends Component {
  state = {
    sending: false
  }

  submitForm = async e => {
    e.preventDefault()
    const { t, client } = this.props
    const envInfo =
      `Cozy Drive Mobile v${appMetadata.version}` +
      `\nOn ${navigator.platform}` +
      `\nFrom ${navigator.vendor}` +
      `\n${navigator.userAgent}`

    const mailContent =
      this.textarea.value.toString() + '\n_______________\n' + envInfo

    const mailData = {
      mode: 'from',
      to: [{ name: 'Support', email: FEEDBACK_EMAIL }],
      subject: t('mobile.rating.email.subject'),
      parts: [{ type: 'text/plain', body: mailContent }]
    }

    try {
      this.setState({ sending: true })
      logInfo(
        `feedback logs: ${this.textarea.value.toString().substr(0, 40)}`,
        client.stackClient.uri
      )
      const jobCollection = client.collection('io.cozy.jobs')
      await jobCollection.create('sendmail', mailData)
    } catch (e) {
      // Sending the email failed; this can happen because of insuficient permissions for example. Not a big deal either in this context.
      // eslint-disable-next-line no-console
      console.error(e)
    }
    this.clearInput()
    this.setState({ sending: false })
    this.props.onClose(true)
  }

  registerElement(element) {
    this.textarea = element
  }

  clearInput() {
    this.textarea.value = ''
  }

  render() {
    const { onClose, t } = this.props
    const { sending } = this.state

    return (
      <ConfirmDialog
        open
        onClose={() => {
          this.clearInput()
          onClose(false)
        }}
        title={t('mobile.rating.feedback.title')}
        content={
          <form
            className={`${styles['feedback-form']} u-mt-0`}
            onSubmit={this.submitForm}
          >
            <textarea
              className={`${styles['feedback-text']} u-bxz u-p-1 u-mb-1 u-w-100`}
              placeholder={t('mobile.rating.email.placeholder')}
              ref={this.registerElement.bind(this)}
            />
            <div className="u-flex">
              <Button
                theme={'secondary'}
                extension="full"
                className="u-mr-half"
                onClick={e => {
                  e.preventDefault()
                  this.clearInput()
                  onClose(false)
                }}
                label={t('mobile.rating.feedback.no')}
              />
              <Button
                busy={sending}
                extension="full"
                className="u-ml-half"
                label={t('mobile.rating.feedback.yes')}
              />
            </div>
          </form>
        }
      />
    )
  }
}

FeedbackForm.propTypes = {
  onClose: PropTypes.func.isRequired
}

export { FeedbackForm }

export default compose(withClient, translate())(FeedbackForm)
