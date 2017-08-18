/* global cozy */
import styles from './share.styl'

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Modal from 'cozy-ui/react/Modal'
import Toggle from 'cozy-ui/react/Toggle'
import classnames from 'classnames'
import { Tab, Tabs, TabList, TabPanels, TabPanel } from 'cozy-ui/react/Tabs'
// import Alerter from 'cozy-ui/react/Alerter'

export const filterSharedDocuments = (ids, doctype) =>
  findPermSets(ids, doctype).then(sets => sets.map(set => set.attributes.permissions.collection.values[0]))

export const findPermSet = (id, doctype) =>
  findPermSets([id], doctype).then(sets => sets.length === 0 ? undefined : sets[0])

// TODO: move this to cozy-client-js
// there is cozy.client.files.getCollectionShareLink already, but I think that
// there is a need of a bit of exploratory work and design for that API...

export const findPermSets = (ids, doctype) =>
  cozy.client.fetchJSON('GET', `/permissions/doctype/${doctype}/sharedByLink`)
    .then(sets => sets.filter(set => {
      const perm = set.attributes.permissions.files
      return perm.type === doctype && ids.find(id => perm.values.indexOf(id) !== -1) !== undefined
    }))

export const createPermSet = (id, doctype) =>
  cozy.client.fetchJSON('POST', `/permissions?codes=email`, {
    data: {
      type: 'io.cozy.permissions',
      attributes: {
        permissions: {
          files: {
            type: 'io.cozy.files',
            verbs: ['GET'],
            values: [id]
          }
        }
      }
    }
  })

export const deletePermSet = (setId) =>
  cozy.client.fetchJSON('DELETE', `/permissions/${setId}`)

export const getShareLink = (id, perms, type) =>
  `${window.location.origin}/public?sharecode=${perms.attributes.codes.email}&id=${id}${type === 'file' ? '&directdownload' : ''}`

export class ShareModal extends React.Component {
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
    const { id } = this.props.document
    findPermSet(id, 'io.cozy.files')
      .then(permissions => {
        if (permissions !== undefined) {
          this.setState({ loading: false, permissions, active: true })
        } else {
          this.setState({ loading: false })
        }
      })
      .catch((err) => this.onError(err))
  }

  toggleShareLink (active) {
    const { id } = this.props.document
    if (active) {
      this.setState({ creating: true })
      createPermSet(id, 'io.cozy.files')
        .then(permissions => this.setState({ active, permissions, creating: false }))
        .catch((err) => this.onError(err))
    } else {
      const setId = this.state.permissions._id
      this.setState({ active, permissions: null })
      deletePermSet(setId)
        .catch((err) => this.onError(err))
    }
  }

  onError (err) {
    console.error(err)
    this.props.onClose()
  }

  render () {
    const t = this.context.t || this.props.t
    const { onClose } = this.props
    const { loading, active, creating, permissions } = this.state
    return (
      <Modal
        title={t('share.title')}
        secondaryAction={onClose}
      >
        <Tabs initialActiveTab='link'>
          <TabList className={styles['share-modal-tabs']}>
            <Tab name='link'>
              {t('share.shareByLink.title')}
            </Tab>
          </TabList>
          <TabPanels className={styles['share-modal-content']}>
            <TabPanel name='link'>
              <ShareWithLinkToggle t={t} active={active} onToggle={checked => this.toggleShareLink(checked)} />
              {active && <ShareWithLink t={t} id={this.props.document.id} type={this.props.document.type} permissions={permissions} onCopy={() => this.setState({ copied: true })} copied={this.state.copied} />}
            </TabPanel>
          </TabPanels>
        </Tabs>
        {creating &&
          <div className={styles['share-modal-footer']}>
            <p>{t('share.creatingLink')}</p>
          </div>
        }
        {loading &&
          <div className={styles['share-modal-footer']}>
            <p>{t('loading.message')}</p>
          </div>
        }
      </Modal>
    )
  }
}

const ShareWithLinkToggle = ({ active, onToggle, t }) => (
  <div className={styles['coz-form-group']}>
    <h3>{t('share.shareByLink.subtitle')}</h3>
    <div className={styles['input-dual']}>
      <div><label for='' className={styles['coz-form-desc']}>{t('share.shareByLink.desc')}</label></div>
      <div>
        <Toggle
          id='share-toggle'
          name='share'
          checked={active}
          onToggle={onToggle} />
      </div>
    </div>
  </div>
)

const ShareWithLink = ({ id, type, permissions, onCopy, copied, t }) => (
  <div className={styles['coz-form']}>
    <h4>{t('share.sharingLink.title')}</h4>
    <div className={styles['input-dual']}>
      <div><input type='text' name='' id='' value={getShareLink(id, permissions, type)} /></div>
      <div>
        {!copied &&
          <CopyToClipboard
            text={getShareLink(id, permissions, type)}
            onCopy={onCopy}
          >
            <div>
              <button className={classnames('coz-btn', 'coz-btn--secondary', styles['btn-copy'])}>
                {t('share.sharingLink.copy')}
              </button>
            </div>
          </CopyToClipboard>
        }
        {copied && <button className={classnames('coz-btn', 'coz-btn--secondary', styles['btn-copied'])} aria-disabled>
          {t('share.sharingLink.copied')}
        </button>}
      </div>
    </div>
  </div>
)
