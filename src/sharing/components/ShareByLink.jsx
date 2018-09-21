import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Toggle from 'cozy-ui/react/Toggle'
import { Spinner } from 'cozy-ui/react'
import Alerter from 'cozy-ui/react/Alerter'

import styles from '../share.styl'

class ShareByLink extends React.Component {
  state = {
    loading: false
  }

  toggleShareLink = checked => {
    if (checked) {
      this.createShareLink()
    } else {
      this.deleteShareLink()
    }
  }

  onCopy = () => {
    Alerter.success(`${this.props.documentType}.share.shareByLink.copied`)
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
    this.setState(state => ({ ...state, loading: true }))
    this.props.onDisable(this.props.document).catch(e => {
      Alerter.error(`${this.props.documentType}.share.error.revoke`)
      console.log(e)
      this.setState(state => ({ ...state, loading: false }))
    })
  }

  render() {
    const t = this.context.t
    const { loading } = this.state
    const { link, checked, documentType } = this.props
    return (
      <div>
        <div className={styles['share-bylink-header']}>
          <h3>{t(`${documentType}.share.shareByLink.subtitle`)}</h3>
          {loading && <Spinner />}
          {loading && (
            <span className={styles['share-bylink-header-creating']}>
              {t(`${documentType}.share.shareByLink.creating`)}
            </span>
          )}
          {checked && (
            <span
              className={styles['share-bylink-header-dot'] + ' u-hide--mob'}
            />
          )}
          {checked && (
            <CopyToClipboard text={link} onCopy={this.onCopy}>
              <button className={styles['share-bylink-header-copybtn']}>
                {t(`${documentType}.share.shareByLink.copy`)}
              </button>
            </CopyToClipboard>
          )}
          <Toggle
            id="share-toggle"
            name="share"
            checked={checked}
            disabled={loading}
            onToggle={this.toggleShareLink}
          />
        </div>
        <div className={styles['share-bylink-desc']}>
          {t(`${documentType}.share.shareByLink.desc`)}
        </div>
      </div>
    )
  }
}

export default ShareByLink
