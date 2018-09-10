/* global cozy */
import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import {
  ButtonLink,
  withBreakpoints,
  Menu,
  MenuItem,
  Icon
} from 'cozy-ui/react'
import { MoreButton } from 'components/Button'
import DownloadButton from './DownloadButton'
import { downloadFiles } from 'drive/web/modules/navigation/duck'
import toolbarstyles from 'drive/styles/toolbar'
import { getQueryParameter } from 'react-cozy-helpers'

import CloudIcon from 'drive/assets/icons/icon-cloud-open.svg'
import DownloadIcon from 'drive/assets/icons/icon-download-16.svg'

const { BarRight } = cozy.bar

const OpenInCozyButton = ({ t, size = 'normal', href = '' }) => (
  <ButtonLink
    href={href}
    size={size}
    label={t('toolbar.menu_open_cozy')}
    icon={CloudIcon}
  />
)

const DownloadFilesButton = ({ t, onDownload, size = 'normal' }) => (
  <DownloadButton
    label={t('toolbar.menu_download_folder')}
    className={toolbarstyles['fil-public-download']}
    onDownload={onDownload}
    theme="secondary"
    size={size}
  />
)
const MoreMenu = ({ onDownload, t }) => (
  <Menu
    title={t('toolbar.item_more')}
    className={classnames(
      toolbarstyles['fil-toolbar-menu'],
      toolbarstyles['fil-toolbar-menu--public']
    )}
    buttonClassName={toolbarstyles['fil-toolbar-more-btn']}
    component={<MoreButton>{t('Toolbar.more')}</MoreButton>}
    position="right"
  >
    <MenuItem icon={<Icon icon={CloudIcon} />}>
      {t('toolbar.menu_open_cozy')}
    </MenuItem>
    <MenuItem onSelect={onDownload} icon={<Icon icon={DownloadIcon} />}>
      {t('toolbar.menu_download_folder')}
    </MenuItem>
  </Menu>
)

class PublicToolbar extends React.Component {
  state = {
    discoveryLink: null
  }

  componentDidMount() {
    this.loadSharingDiscoveryLink()
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

  render() {
    const {
      files,
      onDownload,
      breakpoints: { isMobile },
      renderInBar = false
    } = this.props
    const { t } = this.context
    const { discoveryLink } = this.state

    if (isMobile) {
      return (
        <BarRight>
          <MoreMenu t={t} onDownload={() => onDownload(files)} />
        </BarRight>
      )
    } else if (renderInBar) {
      return (
        <BarRight>
          <div className={toolbarstyles['toolbar-inside-bar']}>
            {discoveryLink && (
              <OpenInCozyButton href={discoveryLink} t={t} size="small" />
            )}
            <DownloadFilesButton
              t={t}
              onDownload={() => onDownload(files)}
              size="small"
            />
          </div>
        </BarRight>
      )
    } else {
      return (
        <div className={toolbarstyles['fil-toolbar-files']} role="toolbar">
          {discoveryLink && <OpenInCozyButton href={discoveryLink} t={t} />}
          <DownloadFilesButton t={t} onDownload={() => onDownload(files)} />
          <BarRight>
            <div />
          </BarRight>
        </div>
      )
    }
  }
}

const mapDispatchToProps = dispatch => ({
  onDownload: files => dispatch(downloadFiles(files))
})

export default connect(null, mapDispatchToProps)(
  withBreakpoints()(PublicToolbar)
)
