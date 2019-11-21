import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-text-to-clipboard'
import Toggle from 'cozy-ui/transpiled/react/Toggle'
import { Spinner, SubTitle } from 'cozy-ui/transpiled/react'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import cx from 'classnames'
import logger from 'lib/logger'

import styles from '../share.styl'
import palette from 'cozy-ui/transpiled/react/palette'

class ShareByLink extends React.Component {
  static contextTypes = {
    t: PropTypes.func.isRequired
  }

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

  copyLinkToClipboard = () => {
    if (copy(this.props.link))
      Alerter.success(`${this.props.documentType}.share.shareByLink.copied`)
    else Alerter.error(`${this.props.documentType}.share.shareByLink.failed`)
  }

  async createShareLink() {
    try {
      this.setState(state => ({ ...state, loading: true }))
      await this.props.onEnable(this.props.document)
    } catch (e) {
      Alerter.error(`${this.props.documentType}.share.error.generic`)
      logger.log(e)
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
      logger.log(e)
    } finally {
      this.setState(state => ({ ...state, loading: false }))
    }
  }

  render() {
    const t = this.context.t
    const { loading } = this.state
    const { checked, documentType } = this.props
    return (
      <div>
        <div
          data-test-id="share-by-link"
          className={cx(styles['share-bylink-header'], 'u-mt-1', 'u-mb-1')}
        >
          <SubTitle>{t(`${documentType}.share.shareByLink.subtitle`)}</SubTitle>
          {loading && <Spinner color={palette.dodgerBlue} />}
          {loading && (
            <span className={styles['share-bylink-header-creating']}>
              {t(`${documentType}.share.shareByLink.creating`)}
            </span>
          )}
          {checked && <span className={styles['share-bylink-header-dot']} />}
          {checked && (
            <button
              data-test-url={this.props.link}
              className={styles['share-bylink-header-copybtn']}
              onClick={this.copyLinkToClipboard}
            >
              {t(`${documentType}.share.shareByLink.copy`)}
            </button>
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
