import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Toggle from 'cozy-ui/react/Toggle'
import { Spinner, SubTitle } from 'cozy-ui/react'
import Alerter from 'cozy-ui/react/Alerter'
import cx from 'classnames'
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

  async createShareLink() {
    try {
      this.setState(state => ({ ...state, loading: true }))
      await this.props.onEnable(this.props.document)
    } catch (e) {
      Alerter.error(`${this.props.documentType}.share.error.generic`)
      console.log(e)
    } finally {
      this.setState(state => ({ ...state, loading: false }))
    }
  }

  async deleteShareLink() {
    try {
      this.setState(state => ({ ...state, loading: true }))
      await this.props.onDisable(this.props.document)
    } catch (e) {
      Alerter.error(`${this.props.documentType}.share.error.revoke`)
      console.log(e)
    } finally {
      this.setState(state => ({ ...state, loading: false }))
    }
  }

  render() {
    const t = this.context.t
    const { loading } = this.state
    const { link, checked, documentType } = this.props
    return (
      <div>
        <div className={cx(styles['share-bylink-header'], 'u-mt-1', 'u-mb-1')}>
          <SubTitle>{t(`${documentType}.share.shareByLink.subtitle`)}</SubTitle>
          {loading && <Spinner />}
          {loading && (
            <span className={styles['share-bylink-header-creating']}>
              {t(`${documentType}.share.shareByLink.creating`)}
            </span>
          )}
          {checked && <span className={styles['share-bylink-header-dot']} />}
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
