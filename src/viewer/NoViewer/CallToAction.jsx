import React, { Component } from 'react'
import Icon from 'cozy-ui/react/Icon'

import localforage from 'localforage'
import {
  isClientAlreadyInstalled,
  isLinux,
  NOVIEWER_DESKTOP_CTA
} from 'components/pushClient'
import styles from '../styles'
import Config from 'drive/config/config.json'

export default class CallToAction extends Component {
  state = {
    mustShow: false
  }

  async componentDidMount() {
    if (Config.promoteDesktop.isActivated !== true) return
    const seen = (await localforage.getItem(NOVIEWER_DESKTOP_CTA)) || false
    if (!seen) {
      try {
        const mustSee = !(await isClientAlreadyInstalled())
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
          color="white"
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
