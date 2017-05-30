import styles from '../styles/share'

import React from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import Toggle from 'cozy-ui/react/Toggle'
import classNames from 'classnames'

const withForm = Component => (
  <div className={styles['coz-form']}>
    {Component}
  </div>
)

export class ShareModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      displayShareLink: false
    }
  }

  toggleShareLink (displayShareLink) {
    this.props.toggleShareLinkCreation(displayShareLink)
    this.setState({ displayShareLink })
  }

  render () {
    const {t, abort, shareLink} = this.props
    return (
      <Modal
        title={t('Albums.share.title')}
        secondaryText={t('Albums.share.close')}
        secondaryAction={abort}
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
                    checked={this.state.displayShareLink}
                    onToggle={checked => this.toggleShareLink(checked)} />
                </div>
              </div>
            </div>
          )}
          {this.state.displayShareLink && withForm(
            <div>
              <h4>{t('Albums.share.sharingLink.title')}</h4>
              <div className={styles['pho-input-dual']}>
                <div><input type='text' name='' id='' value={shareLink} /></div>
                <div>
                  <button className={classNames('coz-btn', 'coz-btn--secondary', styles['pho-btn-copy'])} onClick>{t('Albums.share.sharingLink.copy')}</button>
                </div>
              </div>
            </div>
          )}
          {withForm(
            <div>
              <h3>{t('Albums.share.protectedShare.title')}</h3>
              <div className={styles['coz-form-desc']}>{t('Albums.share.protectedShare.desc')}</div>
            </div>
          )}
        </ModalContent>
      </Modal>
    )
  }
}

export default ShareModal
