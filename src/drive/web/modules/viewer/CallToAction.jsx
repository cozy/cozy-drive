import React, { Component } from 'react'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { withClient } from 'cozy-client'
import localforage from 'localforage'
import {
  isClientAlreadyInstalled,
  isLinux,
  NOVIEWER_DESKTOP_CTA
} from 'components/pushClient'
import styles from './styles.styl'
import Config from 'drive/config/config.json'
import palette from 'cozy-ui/transpiled/react/palette'

class CallToAction extends Component {
  state = {
    mustShow: false
  }

  async componentDidMount() {
    if (Config.promoteDesktop.isActivated !== true) return
    const seen = (await localforage.getItem(NOVIEWER_DESKTOP_CTA)) || false
    if (!seen) {
      try {
        const mustSee = !(await isClientAlreadyInstalled(this.props.client))
        if (mustSee) {
          this.setState({ mustShow: true })
        }
      } catch (e) {
        this.setState({ mustShow: false })
      }
    }
  }

  markAsSeen = () => {
    localforage.setItem(NOVIEWER_DESKTOP_CTA, true)
    this.setState({ mustShow: false })
  }

  render() {
    if (!this.state.mustShow || Config.promoteDesktop.isActivated !== true)
      return null
    const { t } = this.props
    return (
      <div className={styles['pho-viewer-noviewer-cta']}>
        <Icon
          className={styles['pho-viewer-noviewer-cta-cross']}
          color={palette.white}
          icon="cross"
          onClick={this.markAsSeen}
        />
        <h3>{t('Viewer.noviewer.cta.saveTime')}</h3>
        <ul>
          <li>
            <a
              //eslint-disable-next-line react/jsx-no-target-blank
              target="_blank"
              href={t(
                isLinux() ? 'Nav.link-client' : 'Nav.link-client-desktop'
              )}
            >
              {t('Viewer.noviewer.cta.installDesktop')}
            </a>
          </li>
          <li>{t('Viewer.noviewer.cta.accessFiles')}</li>
        </ul>
      </div>
    )
  }
}
export default withClient(CallToAction)
