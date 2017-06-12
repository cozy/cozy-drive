import styles from './share.styl'

import React, { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import Toggle from 'cozy-ui/react/Toggle'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import Alerter from '../../components/Alerter'

import { findPermSet, createPermSet, deletePermSet, getShareLink } from '.'

const withForm = Component => (
  <div className={styles['coz-form']}>
    {Component}
  </div>
)

export class ShareModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      creating: false,
      permissions: null,
      active: false
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

  onError () {
    Alerter.error('Error.generic')
    this.props.onClose()
  }

  render () {
    const { t, onClose, document } = this.props
    const { loading, active, creating, permissions } = this.state
    return (
      <Modal
        title={t('Albums.share.title')}
        secondaryAction={onClose}
      >
        <ModalContent className={styles['pho-share-modal-content']}>
          {withForm(
            <div>
              <h3>{t('Albums.share.shareByLink.title')}</h3>
              <div className={styles['pho-input-dual']}>
                <div><label for='' className={styles['coz-form-desc']}>{t('Albums.share.shareByLink.desc')}</label></div>
                <div>
                  <Toggle
                    id='pho-album-share-toggle'
                    name='share'
                    checked={active}
                    onToggle={checked => this.toggleShareLink(checked)} />
                </div>
              </div>
            </div>
          )}
          {active && withForm(
            <div>
              <h4>{t('Albums.share.sharingLink.title')}</h4>
              <div className={styles['pho-input-dual']}>
                <div><input type='text' name='' id='' value={getShareLink(document._id, permissions)} /></div>
                <div>
                  <CopyToClipboard
                    text={getShareLink(document._id, permissions)}
                    onCopy={() => this.setState({copied: true})}
                  >
                    <button className={classNames('coz-btn', 'coz-btn--secondary', styles['pho-btn-copy'])}>
                      {t('Albums.share.sharingLink.copy')}
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          )}
          {active && withForm(
            <div>
              <h3>{t('Albums.share.protectedShare.title')}</h3>
              <div className={styles['coz-form-desc']}>{t('Albums.share.protectedShare.desc')}</div>
            </div>
          )}
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

export default translate()(ShareModal)
