import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Toggle from 'cozy-ui/react/Toggle'
import { Button } from 'cozy-ui/react'
import Alerter from 'cozy-ui/react/Alerter'

import styles from '../share.styl'

export const ShareWithLinkToggle = (
  { active, loading, onToggle, documentType },
  { t }
) => (
  <div className={styles['coz-form-group']}>
    <h3>{t(`${documentType}.share.shareByLink.subtitle`)}</h3>
    <div className={styles['input-dual']}>
      <div>
        <label htmlFor="" className={styles['coz-form-desc']}>
          {t(`${documentType}.share.shareByLink.desc`)}
        </label>
      </div>
      <div>
        <Toggle
          id="share-toggle"
          name="share"
          checked={active}
          disabled={loading}
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
    <div className={styles['input-dual']}>
      <div>
        <input type="text" name="" id="" value={shareLink} />
      </div>
      <div>
        {!copied && (
          <CopyToClipboard text={shareLink} onCopy={onCopy}>
            <div>
              <Button
                theme="secondary"
                className={styles['pho-btn-copy']}
                label={t(`${documentType}.share.sharingLink.copy`)}
              />
            </div>
          </CopyToClipboard>
        )}
        {copied && (
          <Button
            theme="secondary"
            className={styles['pho-btn-copied']}
            label={t(`${documentType}.share.sharingLink.copied`)}
            aria-disabled
          />
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
    this.setState(state => ({ ...state, copied: false }))
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
      .catch(e => {
        this.setState(state => ({ ...state, loading: false }))
        Alerter.error(`${this.props.documentType}.share.error.generic`)
        console.log(e)
      })
  }

  deleteShareLink() {
    this.props.onDisable(this.props.document).catch(e => {
      Alerter.error(`${this.propsdocumentType}.share.error.revoke`)
      console.log(e)
    })
  }

  render() {
    const t = this.context.t
    const { copied, loading } = this.state
    const { link, checked, documentType } = this.props
    return (
      <div>
        <ShareWithLinkToggle
          active={checked}
          loading={loading}
          onToggle={checked => this.toggleShareLink(checked)}
          documentType={documentType}
        />
        {checked &&
          !loading && (
            <ShareWithLink
              shareLink={link}
              onCopy={() =>
                this.setState(state => ({ ...state, copied: true }))
              }
              copied={copied}
              documentType={documentType}
            />
          )}

        {loading && (
          <div className={styles['share-modal-footer']}>
            <p>{t(`${documentType}.share.gettingLink`)}</p>
          </div>
        )}
      </div>
    )
  }
}

export default ShareByLink
