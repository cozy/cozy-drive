/* global cozy */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import classnames from 'classnames'
import { withBreakpoints, Menu, MenuItem, Icon } from 'cozy-ui/react'
import { MoreButton } from 'components/Button'
import DownloadButton from './DownloadButton'
import { downloadFiles } from 'drive/web/modules/navigation/duck'
import toolbarstyles from 'drive/styles/toolbar'
import { getQueryParameter } from 'react-cozy-helpers'
import CozyHomeLink, { getHomeLinkHref } from 'components/Button/CozyHomeLink'
import OpenInCozyButton from './OpenInCozyButton'

import CloudIcon from 'drive/assets/icons/icon-cloud-open.svg'
import CloudNegative from 'drive/assets/icons/icon-cloud-negative.svg'
import DownloadIcon from 'drive/assets/icons/icon-download-16.svg'

const { BarRight } = cozy.bar

const DownloadFilesButton = ({ t, onDownload, size = 'normal' }) => (
  <DownloadButton
    label={t('toolbar.menu_download_folder')}
    className={toolbarstyles['fil-public-download']}
    onDownload={onDownload}
    theme="secondary"
    size={size}
  />
)

const MoreMenu = ({ t, onDownload, onOpenInCozy, onCreateCozy }) => (
  <Menu
    title={t('toolbar.item_more')}
    className={classnames(
      toolbarstyles['fil-toolbar-menu'],
      toolbarstyles['fil-toolbar-menu--public']
    )}
    buttonClassName={toolbarstyles['fil-toolbar-more-btn']}
    component={<MoreButton />}
    position="right"
  >
    {onOpenInCozy && (
      <MenuItem onSelect={onOpenInCozy} icon={<Icon icon={CloudIcon} />}>
        {t('toolbar.menu_open_cozy')}
      </MenuItem>
    )}
    {onCreateCozy && (
      <MenuItem onSelect={onCreateCozy} icon={<Icon icon={CloudNegative} />}>
        {t('Share.create-cozy')}
      </MenuItem>
    )}
    <MenuItem onSelect={onDownload} icon={<Icon icon={DownloadIcon} />}>
      {t('toolbar.menu_download_folder')}
    </MenuItem>
  </Menu>
)

const MobileToolbar = ({ onDownload, discoveryLink, redirectTo }, { t }) => (
  <BarRight>
    <MoreMenu
      t={t}
      onDownload={onDownload}
      onOpenInCozy={discoveryLink ? () => redirectTo(discoveryLink) : false}
      onCreateCozy={
        discoveryLink
          ? false
          : () => redirectTo(getHomeLinkHref('sharing-drive'))
      }
    />
  </BarRight>
)

const CozybarToolbar = ({ onDownload, discoveryLink }, { t }) => (
  <BarRight>
    <div className={toolbarstyles['toolbar-inside-bar']}>
      {discoveryLink ? (
        <OpenInCozyButton href={discoveryLink} t={t} size="small" />
      ) : (
        <CozyHomeLink from="sharing-drive" />
      )}
      <DownloadFilesButton t={t} onDownload={onDownload} size="small" />
    </div>
  </BarRight>
)

const DesktopToolbar = ({ onDownload, discoveryLink }, { t }) => (
  <div className={toolbarstyles['fil-toolbar-files']} role="toolbar">
    {discoveryLink ? (
      <OpenInCozyButton href={discoveryLink} t={t} />
    ) : (
      <CozyHomeLink from="sharing-drive" />
    )}
    <DownloadFilesButton t={t} onDownload={onDownload} />
    <BarRight>
      <div />
    </BarRight>
  </div>
)

class PublicToolbar extends React.Component {
  state = {
    discoveryLink: null
  }

  componentDidMount() {
    if (window.location.pathname === '/preview') this.loadSharingDiscoveryLink()
  }

  async loadSharingDiscoveryLink() {
    try {
      const { client } = this.context
      const response = await client
        .collection('io.cozy.permissions')
        .getOwnPermissions()
      const sourceId = response.data.attributes.source_id
      const sharingId = sourceId.split('/')[1]

      const { sharecode } = getQueryParameter()

      const link = client
        .collection('io.cozy.sharings')
        .getDiscoveryLink(sharingId, sharecode)
      this.setState({ discoveryLink: link })
    } catch (err) {
      console.warn('Failed to load sharing discovery link', err)
    }
  }

  redirectTo(url) {
    this.props.router.push(url)
  }

  downloadFiles = () => {
    this.props.onDownload(this.props.files)
  }

  render() {
    const { breakpoints: { isMobile }, renderInBar = false } = this.props
    const { discoveryLink } = this.state

    if (isMobile) {
      return (
        <MobileToolbar
          onDownload={this.downloadFiles}
          discoveryLink={discoveryLink}
          redirectTo={this.redirectTo}
        />
      )
    } else if (renderInBar) {
      return (
        <CozybarToolbar
          onDownload={this.downloadFiles}
          discoveryLink={discoveryLink}
        />
      )
    } else {
      return (
        <DesktopToolbar
          onDownload={this.downloadFiles}
          discoveryLink={discoveryLink}
        />
      )
    }
  }
}

const mapDispatchToProps = dispatch => ({
  onDownload: files => dispatch(downloadFiles(files))
})

export default connect(null, mapDispatchToProps)(
  withBreakpoints()(withRouter(PublicToolbar))
)
