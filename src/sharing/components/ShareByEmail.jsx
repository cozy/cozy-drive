import React from 'react'
import classnames from 'classnames'

import Alerter from 'photos/components/Alerter'
import ShareAutocomplete from './ShareAutocomplete'
import WhoHasAccess from './WhoHasAccess'
import { share } from '..'

import styles from '../share.styl'

class ShareByEmail extends React.Component {
  share (recipient, sharingType) {
    const { document, documentType, sharingDesc } = this.props
    return share(document, recipient, sharingType, sharingDesc)
      .then(sharing => {
        Alerter.info(`${documentType}.share.shareByEmail.success`, { email: recipient.email })
      })
      .catch(err => {
        Alerter.error('Error.generic')
        throw err
      })
  }

  render () {
    const { document, documentType } = this.props
    return (
      <div>
        <ShareByUrl
          onSend={(recipient, sharingType) => this.share(recipient, sharingType)}
          documentType={documentType}
        />
        <WhoHasAccess document={document} />
      </div>
    )
  }
}

class ShareByUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      url: undefined,
      id: undefined,
      sharingType: 'master-slave'
    }
  }

  onAutocomplete (email, url, id) {
    this.setState(state => ({ ...state, email, url, id }))
  }

  reset () {
    this.setState(state => ({
      ...state,
      email: '',
      url: undefined,
      id: undefined,
      sharingType: 'master-slave' }))
  }

  sendSharingLink () {
    const {email, url, id, sharingType} = this.state
    this.props.onSend({email, url, id}, sharingType)
    .then(() => {
      this.reset()
    })
    .catch(() => {
      this.reset()
    })
  }

  changeSharingType (sharingType) {
    this.setState(state => ({ ...state, sharingType }))
  }

  render () {
    const { t } = this.context
    const { documentType } = this.props
    return (
      <div className={styles['coz-form-group']}>
        <h3>{t(`${documentType}.share.shareByEmail.subtitle`)}</h3>
        <div className={styles['coz-form']}>
          <label className={styles['coz-form-label']} for='email'>{t(`${documentType}.share.shareByEmail.email`)}</label>
          <ShareAutocomplete
            value={this.state.email}
            onChange={(email, url, id) => this.onAutocomplete(email, url, id)}
          />
        </div>
        <div className={classnames(styles['coz-form-controls'], styles['coz-form-controls--dispatch'])}>
          <select
            name='select'
            className={styles['coz-select']}
            value={this.state.sharingType}
            onChange={e => this.changeSharingType(e.target.value)}>
            <option value='master-slave'>{t('Share.status.accepted.master-slave')}</option>
            <option value='master-master'>{t('Share.status.accepted.master-master')}</option>
          </select>
          <button
            className={classnames('coz-btn', 'coz-btn--regular')}
            disabled={!this.state.email}
            onClick={e => this.sendSharingLink()}>
            {t(`${documentType}.share.shareByEmail.send`)}
          </button>
        </div>
      </div>
    )
  }
}

export default ShareByEmail
