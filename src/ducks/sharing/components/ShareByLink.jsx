import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import classnames from 'classnames'
import Toggle from 'cozy-ui/react/Toggle'
import { deletePermission, createShareLink } from '..'

import styles from '../share.styl'

export const ShareWithLinkToggle = ({ active, onToggle }, { t }) => (
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

export const ShareWithLink = ({ shareLink, onCopy, copied }, { t }) => (
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

class ShareByLink extends React.Component {
  state = {
    checked: false,
    copied: false,
    loading: false,
    sharing: undefined
  }

  componentDidMount () {
    this.fetchShareLink()
    this.setState(state => ({...state, checked: true}))
  }

  toggleShareLink (checked) {
    if (checked) {
      this.fetchShareLink()
    } else {
      // destroy link
      this.deleteShareLink()
    }
    this.setState(state => ({...state, checked}))
  }

  fetchShareLink () {
    this.setState(state => ({...state, loading: true}))
    createShareLink(this.props.document._id).then(
      (sharing) => {
        this.setState(state => ({...state, loading: false, sharing}))
      }
    )
  }

  deleteShareLink () {
    deletePermission(this.state.sharing.id)
    this.setState(state => ({...state, sharing: undefined}))
  }

  render () {
    const t = this.context.t
    const {checked, copied, loading, sharing} = this.state
    return (
      <div>
        <ShareWithLinkToggle active={checked} onToggle={checked => this.toggleShareLink(checked)} />
        {checked && !loading && <ShareWithLink
          shareLink={sharing.sharelink}
          onCopy={() => this.setState(state => ({ ...state, copied: true }))}
          copied={copied} />}

        {loading &&
          <div className={styles['pho-share-modal-footer']}>
            <p>{t('Albums.share.gettingLink')}</p>
          </div>
        }
      </div>
    )
  }
}

export default ShareByLink
