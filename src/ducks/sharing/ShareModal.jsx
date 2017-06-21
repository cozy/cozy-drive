import styles from './share.styl'

import React, { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import Toggle from 'cozy-ui/react/Toggle'
import classnames from 'classnames'
import { Tab, Tabs, TabList, TabPanels, TabPanel } from 'cozy-ui/react/Tabs'
import Alerter from '../../components/Alerter'

import { findPermSet, createPermSet, deletePermSet, getShareLink, share } from '.'

export class ShareModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      creating: false,
      permissions: null,
      active: false,
      copied: false
    }
  }

  componentDidMount () {
    const { _id, _type } = this.props.document
    findPermSet(_id, _type)
      .then(permissions => {
        if (permissions !== undefined) {
          this.setState({ loading: false, permissions, active: true })
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
        .then(permissions => this.setState({ active, permissions, creating: false }))
        .catch(() => this.onError())
    } else {
      const setId = this.state.permissions._id
      this.setState({ active, permissions: null })
      deletePermSet(setId)
        .catch(() => this.onError())
    }
  }

  sendSharingLinks (email, url) {
    const { _id, _type } = this.props.document
    return share(_id, _type, email, url)
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
    const { loading, active, creating, permissions } = this.state
    return (
      <Modal
        title={t('Albums.share.title')}
        secondaryAction={onClose}
      >
        <ModalContent className={styles['pho-share-modal-content']}>
          <Tabs initialActiveTab='link'>
            <TabList>
              <Tab name='link'>
                {t('Albums.share.shareByLink.title')}
              </Tab>
              <Tab name='url'>
                {t('Albums.share.shareByUrl.title')}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel name='link'>
                <ShareWithLinkToggle active={active} onToggle={checked => this.toggleShareLink(checked)} />
                {active && <ShareWithLink id={this.props.document._id} permissions={permissions} onCopy={() => console.log(this) || this.setState({ copied: true })} copied={this.state.copied} />}
              </TabPanel>
              <TabPanel name='url'>
                <ShareByUrl onSend={(email, url) => this.sendSharingLinks(email, url)} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
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
      <div className={styles['coz-form']}>
        <h3>{t('Albums.share.shareByUrl.subtitle')}</h3>
        <div>
          <h4>{t('Albums.share.shareByUrl.email')}</h4>
          <input
            type='text'
            name=''
            id=''
            onChange={e => this.changeEmail(e.target.value)}
            value={this.state.email}
            placeholder={t('Albums.share.shareByUrl.emailPlaceholder')} />
        </div>
        <div>
          <h4>{t('Albums.share.shareByUrl.url')}</h4>
          <input
            type='text'
            name=''
            id=''
            onChange={e => this.changeUrl(e.target.value)}
            value={this.state.url}
            placeholder={t('Albums.share.shareByUrl.urlPlaceholder')} />
        </div>
        <div>
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
  <div className={styles['coz-form']}>
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

const ShareWithLink = ({ id, permissions, onCopy, copied }, { t }) => (
  <div className={styles['coz-form']}>
    <h4>{t('Albums.share.sharingLink.title')}</h4>
    <div className={styles['pho-input-dual']}>
      <div><input type='text' name='' id='' value={getShareLink(id, permissions)} /></div>
      <div>
        {!copied &&
          <CopyToClipboard
            text={getShareLink(id, permissions)}
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

export default ShareModal
