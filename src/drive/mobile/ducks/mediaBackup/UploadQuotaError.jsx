/* global cozy */
import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { Button, Icon } from 'cozy-ui/react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from './styles'

const FEEDBACK_EMAIL = 'contact@cozycloud.cc'

class QuotaModal extends Component {
  state = {
    sending: false,
    sent: false
  }

  sendEmail = async e => {
    e.preventDefault()

    const { t } = this.context
    const mailData = {
      mode: 'from',
      to: [{ name: 'Support', email: FEEDBACK_EMAIL }],
      subject: t('mobile.quota_feedback.email_subject'),
      parts: [{ type: 'text/plain', body: this.textarea.value.toString() }]
    }

    try {
      this.setState({ sending: true })
      await cozy.client.jobs.create('sendmail', mailData)
    } catch (e) {
      // Sending the email failed; this can happen because of insuficient permissions for example. Not a big deal either in this context.
    }

    this.textarea.value = ''

    this.setState({
      sending: false,
      sent: true
    })
  }

  registerElement = element => {
    this.textarea = element
  }

  render() {
    const { t, onClose } = this.props
    const { sending, sent } = this.state

    return sent ? (
      <Modal
        title={t('mobile.quota_feedback.title_sent')}
        primaryAction={onClose}
        primaryText={t('mobile.quota_feedback.button_sent')}
        primaryType="regular"
        secondaryAction={onClose}
        description={t('mobile.quota_feedback.text_sent')}
      />
    ) : (
      <Modal title={t('mobile.quota_feedback.title')} secondaryAction={onClose}>
        <ModalContent className={styles['feedback-form']}>
          <form className={styles['coz-form']} onSubmit={this.sendEmail}>
            <label className={styles['coz-form-label']}>
              {t('mobile.quota_feedback.description')}
            </label>
            <textarea
              className={styles['feedback-text']}
              ref={this.registerElement}
            />
            <div className={styles['button-block']}>
              <Button disabled={sending} aria-busy={sending}>
                <Icon icon="paperplane" />
                {t('mobile.quota_feedback.button')}
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    )
  }
}

QuotaModal.propTypes = {
  t: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

class UploadQuotaError extends Component {
  state = {
    modalOpened: false
  }

  toggleModal = modalOpened => {
    this.setState({ modalOpened })
  }

  render() {
    const { t } = this.props
    const { modalOpened } = this.state
    return (
      <div
        className={classnames(
          styles['coz-upload-status'],
          styles['coz-upload-status--error']
        )}
      >
        <div className={styles['coz-upload-status-content']}>
          <div>{t('mobile.settings.media_backup.quota')}</div>
          <button
            className={styles['coz-upload-status-link']}
            onClick={() => this.toggleModal(true)}
          >
            {t('mobile.settings.media_backup.quota_contact')}
          </button>
        </div>
        {modalOpened && (
          <QuotaModal t={t} onClose={() => this.toggleModal(false)} />
        )}
      </div>
    )
  }
}

UploadQuotaError.propTypes = {
  t: PropTypes.func.isRequired
}

export default UploadQuotaError
