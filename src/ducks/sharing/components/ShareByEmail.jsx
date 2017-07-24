import React from 'react'
import classnames from 'classnames'

import Alerter from '../../../components/Alerter'
import ShareAutocomplete from './ShareAutocomplete'
import WhoHasAccess from './WhoHasAccess'
import { share } from '..'

import styles from '../share.styl'

class ShareByEmail extends React.Component {
  sendSharingLinks (email, url) {
    return share(this.props.document, email, url)
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
        <ShareByUrl onSend={(email, url) => this.sendSharingLinks(email, url)} />
        <WhoHasAccess document={this.props.document} />
      </div>
    )
  }
}

class ShareByUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      url: ''
    }
  }

  onAutocomplete (email, url) {
    this.changeEmail(email)
    if (url) this.changeUrl(url)
  }

  changeEmail (email) {
    this.setState({ email })
  }

  changeUrl (url) {
    this.setState({ url })
  }

  sendSharingLink () {
    this.props.onSend(this.state.email, this.state.url)
    .then(() => {
      this.setState(state => ({email: '', url: ''}))
    })
    .catch(() => {
      this.setState(state => ({email: '', url: ''}))
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
            disabled={!this.state.email || !this.state.url}
            onClick={e => this.sendSharingLink()}>
            {t('Albums.share.shareByEmail.send')}
          </button>
        </div>
      </div>
    )
  }
}

export default ShareByEmail
