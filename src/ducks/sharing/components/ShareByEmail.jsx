import React from 'react'
import classnames from 'classnames'

import Alerter from '../../../components/Alerter'
import ShareAutocomplete from './ShareAutocomplete'
import WhoHasAccess from './WhoHasAccess'
import { share } from '..'

import styles from '../share.styl'

class ShareByEmail extends React.Component {
  sendSharingLinks (email) {
    return share(this.props.document, email)
    .then(sharing => {
      Alerter.info('Albums.share.shareByEmail.success', { email })
    })
    .catch(err => {
      Alerter.error('Error.generic')
      throw err
    })
  }

  render () {
    return (
      <div>
        <ShareByUrl onSend={(email) => this.sendSharingLinks(email)} />
        <WhoHasAccess document={this.props.document} />
      </div>
    )
  }
}

class ShareByUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  onAutocomplete (email) {
    this.changeEmail(email)
  }

  changeEmail (email) {
    this.setState({ email })
  }

  sendSharingLink () {
    this.props.onSend(this.state.email)
    .then(() => {
      this.setState(state => ({...state, email: ''}))
    })
    .catch(() => {
      this.setState(state => ({...state, email: ''}))
    })
  }

  render () {
    const { t } = this.context
    return (
      <div className={styles['coz-form-group']}>
        <h3>{t('Albums.share.shareByEmail.subtitle')}</h3>
        <div className={styles['coz-form']}>
          <label className={styles['coz-form-label']} for='email'>{t('Albums.share.shareByEmail.email')}</label>
          <ShareAutocomplete
            value={this.state.email}
            onChange={(email, url) => this.onAutocomplete(email, url)}
            />
        </div>
        <div className={classnames(styles['coz-form-controls'], styles['coz-form-controls--dispatch'])}>
          <button
            className={classnames('coz-btn', 'coz-btn--regular')}
            disabled={!this.state.email}
            onClick={e => this.sendSharingLink()}>
            {t('Albums.share.shareByEmail.send')}
          </button>
        </div>
      </div>
    )
  }
}

export default ShareByEmail
