import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import classnames from 'classnames'
import Toggle from 'cozy-ui/react/Toggle'

import styles from '../share.styl'

export const ShareWithLinkToggle = (
  { active, onToggle, documentType },
  { t }
) => (
  <div className={styles['coz-form-group']}>
    <h3>{t(`${documentType}.share.shareByLink.subtitle`)}</h3>
    <div className={styles['pho-input-dual']}>
      <div>
        <label htmlFor="" className={styles['coz-form-desc']}>
          {t(`${documentType}.share.shareByLink.desc`)}
        </label>
      </div>
      <div>
        <Toggle
          id="pho-album-share-toggle"
          name="share"
          checked={active}
          onToggle={onToggle}
        />
      </div>
    </div>
  </div>
)

export const ShareWithLink = (
  { shareLink, onCopy, copied, documentType },
  { t }
) => (
  <div className={styles['coz-form']}>
    <h4>{t(`${documentType}.share.sharingLink.title`)}</h4>
    <div className={styles['pho-input-dual']}>
      <div>
        <input type="text" name="" id="" value={shareLink} />
      </div>
      <div>
        {!copied && (
          <CopyToClipboard text={shareLink} onCopy={onCopy}>
            <div>
              <button
                className={classnames(
                  styles['c-btn'],
                  styles['c-btn--secondary'],
                  styles['pho-btn-copy']
                )}
              >
                {t(`${documentType}.share.sharingLink.copy`)}
              </button>
            </div>
          </CopyToClipboard>
        )}
        {copied && (
          <button
            className={classnames(
              styles['c-btn'],
              styles['c-btn--secondary'],
              styles['pho-btn-copied']
            )}
            aria-disabled
          >
            {t(`${documentType}.share.sharingLink.copied`)}
          </button>
        )}
      </div>
    </div>
  </div>
)

class ShareByLink extends React.Component {
  state = {
    copied: false,
    loading: false
  }

  toggleShareLink(checked) {
    if (checked) {
      this.createShareLink()
    } else {
      this.deleteShareLink()
    }
  }

  createShareLink() {
    this.setState(state => ({ ...state, loading: true }))
    this.props
      .onEnable(this.props.document)
      .then(() => this.setState(state => ({ ...state, loading: false })))
  }

  deleteShareLink() {
    this.props.onDisable(this.props.document)
  }

  render() {
    const t = this.context.t
    const { copied, loading } = this.state
    const { link, checked, documentType } = this.props
    return (
      <div>
        <ShareWithLinkToggle
          active={checked}
          onToggle={checked => this.toggleShareLink(checked)}
          documentType={documentType}
        />
        {checked &&
          !loading && (
            <ShareWithLink
              shareLink={link}
              onCopy={() =>
                this.setState(state => ({ ...state, copied: true }))}
              copied={copied}
              documentType={documentType}
            />
          )}

        {loading && (
          <div className={styles['pho-share-modal-footer']}>
            <p>{t(`${documentType}.share.gettingLink`)}</p>
          </div>
        )}
      </div>
    )
  }
}

export default ShareByLink
