/* global cozy */
import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'

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

const DownloadFilesButton = ({ t, onDownload, size, isFile }) => (
  <DownloadButton
    label={
      isFile
        ? t('toolbar.menu_download_file')
        : t('toolbar.menu_download_folder')
    }
    className={toolbarstyles['fil-public-download']}
    onDownload={onDownload}
    theme="secondary"
    size={size}
  />
)
DownloadFilesButton.propTypes = {
  t: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  isFile: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['tiny', 'small', 'large'])
}

const MoreMenu = ({ t, onDownload, onOpenInCozy, onCreateCozy, isFile }) => (
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
      {isFile
        ? t('toolbar.menu_download_file')
        : t('toolbar.menu_download_folder')}
    </MenuItem>
  </Menu>
)
MoreMenu.propTypes = {
  t: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onOpenInCozy: PropTypes.func,
  onCreateCozy: PropTypes.func,
  isFile: PropTypes.bool.isRequired
}

const toolbarProptypes = {
  onDownload: PropTypes.func.isRequired,
  discoveryLink: PropTypes.string,
  isFile: PropTypes.bool.isRequired
}
const openExternalLink = url => (window.location = url)

const MobileToolbar = ({ onDownload, discoveryLink, isFile }, { t }) => (
  <BarRight>
    <MoreMenu
      isFile={isFile}
      t={t}
      onDownload={onDownload}
      onOpenInCozy={
        discoveryLink ? () => openExternalLink(discoveryLink) : false
      }
      onCreateCozy={
        discoveryLink
          ? false
          : () => openExternalLink(getHomeLinkHref('sharing-drive'))
      }
    />
  </BarRight>
)
MobileToolbar.propTypes = toolbarProptypes

const CozybarToolbar = ({ onDownload, discoveryLink, isFile }, { t }) => (
  <BarRight>
    <div className={toolbarstyles['toolbar-inside-bar']}>
      {discoveryLink ? (
        <OpenInCozyButton href={discoveryLink} t={t} size="small" />
      ) : (
        <CozyHomeLink from="sharing-drive" t={t} />
      )}
      <DownloadFilesButton
        t={t}
        onDownload={onDownload}
        size="small"
        isFile={isFile}
      />
    </div>
  </BarRight>
)
CozybarToolbar.propTypes = toolbarProptypes

const DesktopToolbar = ({ onDownload, discoveryLink, isFile }, { t }) => (
  <div
    data-test-id="fil-toolbar-files-public"
    className={toolbarstyles['fil-toolbar-files']}
    role="toolbar"
  >
    {discoveryLink ? (
      <OpenInCozyButton href={discoveryLink} t={t} />
    ) : (
      <CozyHomeLink from="sharing-drive" t={t} />
    )}
    <DownloadFilesButton t={t} onDownload={onDownload} isFile={isFile} />
    <BarRight>
      <div />
    </BarRight>
  </div>
)
DesktopToolbar.propTypes = toolbarProptypes

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

  downloadFiles = () => {
    this.props.onDownload(this.props.files)
  }

  render() {
    const {
      breakpoints: { isMobile },
      renderInBar = false,
      isFile
    } = this.props
    const { discoveryLink } = this.state

    if (isMobile) {
      return (
        <MobileToolbar
          onDownload={this.downloadFiles}
          discoveryLink={discoveryLink}
          isFile={isFile}
        />
      )
    } else if (renderInBar) {
      return (
        <CozybarToolbar
          onDownload={this.downloadFiles}
          discoveryLink={discoveryLink}
          isFile={isFile}
        />
      )
    } else {
      return (
        <DesktopToolbar
          onDownload={this.downloadFiles}
          discoveryLink={discoveryLink}
          isFile={isFile}
        />
      )
    }
  }
}
PublicToolbar.propTypes = {
  isFile: PropTypes.bool.isRequired,
  renderInBar: PropTypes.bool,
  breakpoints: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired
}
const mapDispatchToProps = dispatch => ({
  onDownload: files => dispatch(downloadFiles(files))
})

export default connect(
  null,
  mapDispatchToProps
)(withBreakpoints()(PublicToolbar))
