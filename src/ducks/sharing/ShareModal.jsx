import styles from './share.styl'

import React, { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Modal from 'cozy-ui/react/Modal'
import Toggle from 'cozy-ui/react/Toggle'
import classnames from 'classnames'
import { Tab, Tabs, TabList, TabPanels, TabPanel } from 'cozy-ui/react/Tabs'
import Alerter from '../../components/Alerter'
import Recipient from '../../components/Recipient'
import ShareAutocomplete from './ShareAutocomplete'

import { findPermSetByLink, createPermSet, deletePermSet, getShareLink, share } from '.'

export class ShareModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      creating: false,
      byLinkPermissions: null,
      active: false,
      copied: false
    }
  }

  componentDidMount () {
    const { _id, _type } = this.props.document
    findPermSetByLink(_id, _type)
      .then(byLinkPermissions => {
        if (byLinkPermissions !== undefined) {
          this.setState({ loading: false, byLinkPermissions, active: true })
        } else {
          this.setState({ loading: false })
        }
      })
      .catch(() => this.onError())
  }

  toggleShareLink (active) {
    const { _id, _type } = this.props.document
    if (active) {
      this.setState({ creating: true })
      createPermSet(_id, _type)
        .then(byLinkPermissions => this.setState({ active, byLinkPermissions, creating: false }))
        .catch(() => this.onError())
    } else {
      const setId = this.state.byLinkPermissions._id
      this.setState({ active, byLinkPermissions: null })
      deletePermSet(setId)
        .catch(() => this.onError())
    }
  }

  sendSharingLinks (email, url) {
    return share(this.props.document, email, url)
    .then(sharing => {
      Alerter.info('Albums.share.shareByUrl.success', { email })
    })
    .catch(err => {
      Alerter.error('Error.generic')
      throw err
    })
  }

  onError () {
    Alerter.error('Error.generic')
    this.props.onClose()
  }

  render () {
    const { t } = this.context
    const { onClose } = this.props
    const { loading, active, creating, byLinkPermissions } = this.state
    return (
      <Modal
        title={t('Albums.share.title')}
        secondaryAction={onClose}
      >
        <Tabs initialActiveTab='link'>
          <TabList className={styles['pho-share-modal-tabs']}>
            <Tab name='link'>
              {t('Albums.share.shareByLink.title')}
            </Tab>
            <Tab name='url'>
              {t('Albums.share.shareByUrl.title')}
            </Tab>
            <Tab name='access'>
              {t('Albums.share.whoHasAccess.title')}
            </Tab>
          </TabList>
          <TabPanels className={styles['pho-share-modal-content']}>
            <TabPanel name='link'>
              <ShareWithLinkToggle active={active} onToggle={checked => this.toggleShareLink(checked)} />
              {active && <ShareWithLink shareLink={getShareLink(this.props.document._id, byLinkPermissions)} onCopy={() => this.setState({ copied: true })} copied={this.state.copied} />}
            </TabPanel>
            <TabPanel name='url'>
              <ShareByUrl onSend={(email, url) => this.sendSharingLinks(email, url)} />
            </TabPanel>
            <TabPanel name='access'>
              <WhoHasAccess />
            </TabPanel>
          </TabPanels>
        </Tabs>
        {creating &&
          <div className={styles['pho-share-modal-footer']}>
            <p>{t('Albums.share.creatingLink')}</p>
          </div>
        }
        {loading &&
          <div className={styles['pho-share-modal-footer']}>
            <p>{t('Albums.share.loading')}</p>
          </div>
        }
      </Modal>
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
        <h3>{t('Albums.share.shareByUrl.subtitle')}</h3>
        <div className={styles['coz-form']}>
          <label className={styles['coz-form-label']} for='email'>{t('Albums.share.shareByUrl.email')}</label>
          <ShareAutocomplete
            value={this.state.email}
            onChange={(email, url) => this.onAutocomplete(email, url)}
            />
        </div>
        <div className={styles['coz-form']}>
          <label className={styles['coz-form-label']} for='url'>{t('Albums.share.shareByUrl.url')}</label>
          <input
            type='text'
            name=''
            id='url'
            onChange={e => this.changeUrl(e.target.value)}
            value={this.state.url}
            placeholder={t('Albums.share.shareByUrl.urlPlaceholder')} />
        </div>
        <div className={classnames(styles['coz-form-controls'], styles['coz-form-controls--dispatch'])}>
          <button
            className={classnames('coz-btn', 'coz-btn--regular')}
            disabled={!this.state.email || !this.state.url}
            onClick={e => this.sendSharingLink()}>
            {t('Albums.share.shareByUrl.send')}
          </button>
        </div>
      </div>
    )
  }
}

const ShareWithLinkToggle = ({ active, onToggle }, { t }) => (
  <div className={styles['coz-form-group']}>
    <h3>{t('Albums.share.shareByLink.subtitle')}</h3>
    <div className={styles['pho-input-dual']}>
      <div><label for='' className={styles['coz-form-desc']}>{t('Albums.share.shareByLink.desc')}</label></div>
      <div>
        <Toggle
          id='pho-album-share-toggle'
          name='share'
          checked={active}
          onToggle={onToggle} />
      </div>
    </div>
  </div>
)

const ShareWithLink = ({ shareLink, onCopy, copied }, { t }) => (
  <div className={styles['coz-form']}>
    <h4>{t('Albums.share.sharingLink.title')}</h4>
    <div className={styles['pho-input-dual']}>
      <div><input type='text' name='' id='' value={shareLink} /></div>
      <div>
        {!copied &&
          <CopyToClipboard
            text={shareLink}
            onCopy={onCopy}
          >
            <div>
              <button className={classnames('coz-btn', 'coz-btn--secondary', styles['pho-btn-copy'])}>
                {t('Albums.share.sharingLink.copy')}
              </button>
            </div>
          </CopyToClipboard>
        }
        {copied && <button className={classnames('coz-btn', 'coz-btn--secondary', styles['pho-btn-copied'])} aria-disabled>
          {t('Albums.share.sharingLink.copied')}
        </button>}
      </div>
    </div>
  </div>
)

const WhoHasAccess = ({ t }) => (
  <div>
    <Recipient user={'michael@scott.com'} url={'michaelscott.mycozy.cloud'} status={'Invited'} />
    <Recipient user={'Jim Halpert'} url={'jimmy.mycozy.cloud'} status={'Can view'} />
    <Recipient user={'dwight@dundermifflin.com'} url={'dschrute.mycozy.cloud'} status={'Can edit'} />
  </div>
)

export default ShareModal
