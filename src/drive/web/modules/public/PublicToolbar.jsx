/* global cozy */
import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import logger from 'lib/logger'
import { withClient, useClient } from 'cozy-client'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'

import { MoreButton } from 'components/Button'
import DownloadButton from './DownloadButton'
import { downloadFiles } from 'drive/web/modules/actions/utils'
import toolbarstyles from 'drive/styles/toolbar.styl'
import { getQueryParameter } from 'react-cozy-helpers'
import CozyHomeLink from 'components/Button/CozyHomeLink'
import getHomeLinkHref from 'components/Button/getHomeLinkHref'
import OpenInCozyButton from './OpenInCozyButton'

import DownloadIcon from 'drive/assets/icons/icon-download-16.svg'

import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import SelectableItem from 'drive/web/modules/drive/Toolbar/selectable/SelectableItem'
import AddFolderItem from 'drive/web/modules/drive/Toolbar/components/AddFolderItem'
import UploadItem from 'drive/web/modules/drive/Toolbar/components/UploadItem'
import CreateShortcut from 'drive/web/modules/drive/Toolbar/components/CreateShortcut'

const { BarRight } = cozy.bar

const DownloadFilesButton = ({ t, onDownload, size, isFile }) => (
  <DownloadButton
    label={
      isFile
        ? t('toolbar.menu_download_file')
        : t('toolbar.menu_download_folder')
    }
    data-test-id="fil-public-download"
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

const MoreMenu = withBreakpoints()(
  ({
    t,
    onDownload,
    onOpenInCozy,
    onCreateCozy,
    isFile,
    hasWriteAccess,
    refreshFolderContent,
    breakpoints: { isMobile }
  }) => {
    const anchorRef = React.createRef()
    const [menuIsVisible, setMenuVisible] = useState(false)

    const openMenu = useCallback(() => setMenuVisible(true), [setMenuVisible])
    const closeMenu = useCallback(() => setMenuVisible(false), [setMenuVisible])

    return (
      <div>
        <div ref={anchorRef}>
          <MoreButton onClick={openMenu} />
        </div>

        {menuIsVisible && (
          <ActionMenu
            placement="bottom-end"
            anchorElRef={anchorRef}
            onClose={closeMenu}
            autoclose
          >
            {onOpenInCozy &&
              isMobile && (
                <ActionMenuItem
                  onClick={onOpenInCozy}
                  left={<Icon icon={'to-the-cloud'} />}
                >
                  {t('toolbar.menu_open_cozy')}
                </ActionMenuItem>
              )}
            {onCreateCozy &&
              isMobile && (
                <ActionMenuItem
                  onClick={onCreateCozy}
                  left={<Icon icon={'cloud'} />}
                >
                  {t('Share.create-cozy')}
                </ActionMenuItem>
              )}
            <ActionMenuItem
              onClick={onDownload}
              left={<Icon icon={DownloadIcon} />}
            >
              {isFile
                ? t('toolbar.menu_download_file')
                : t('toolbar.menu_download_folder')}
            </ActionMenuItem>
            {hasWriteAccess && <AddFolderItem />}
            {hasWriteAccess && (
              <CreateShortcut onCreated={refreshFolderContent} />
            )}
            {hasWriteAccess && <UploadItem onUploaded={refreshFolderContent} />}
            <SelectableItem />
          </ActionMenu>
        )}
      </div>
    )
  }
)
MoreMenu.propTypes = {
  t: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onOpenInCozy: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onCreateCozy: PropTypes.func,
  isFile: PropTypes.bool.isRequired
}

const toolbarProptypes = {
  onDownload: PropTypes.func.isRequired,
  discoveryLink: PropTypes.string,
  isFile: PropTypes.bool.isRequired,
  hasWriteAccess: PropTypes.bool,
  refreshFolderContent: PropTypes.func.isRequired
}
const openExternalLink = url => (window.location = url)

const MobileToolbar = (
  { onDownload, discoveryLink, isFile, hasWriteAccess, refreshFolderContent },
  { store }
) => {
  const client = useClient()
  const { t } = useI18n()
  return (
    <BarRight>
      <BarContextProvider client={client} t={t} store={store}>
        <MoreMenu
          isFile={isFile}
          hasWriteAccess={hasWriteAccess}
          t={t}
          refreshFolderContent={refreshFolderContent}
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
      </BarContextProvider>
    </BarRight>
  )
}

MobileToolbar.contextTypes = {
  store: PropTypes.object.isRequired
}

MobileToolbar.propTypes = toolbarProptypes

const CozybarToolbar = ({ onDownload, discoveryLink, isFile }, { store }) => {
  const client = useClient()
  const { t } = useI18n()
  return (
    <BarRight>
      <BarContextProvider client={client} t={t} store={store}>
        <div
          data-test-id="toolbar-viewer-public"
          className={toolbarstyles['toolbar-inside-bar']}
        >
          {discoveryLink ? (
            <OpenInCozyButton href={discoveryLink} t={t} size="small" />
          ) : (
            <CozyHomeLink from="sharing-drive" t={t} size="small" />
          )}
          <DownloadFilesButton
            t={t}
            onDownload={onDownload}
            size="small"
            isFile={isFile}
          />
        </div>
      </BarContextProvider>
    </BarRight>
  )
}

CozybarToolbar.contextTypes = {
  store: PropTypes.object.isRequired
}

CozybarToolbar.propTypes = toolbarProptypes

const DesktopToolbar = (
  { onDownload, discoveryLink, isFile, hasWriteAccess, refreshFolderContent },
  { t }
) => (
  <div
    data-test-id="toolbar-files-public"
    className={toolbarstyles['fil-toolbar-files']}
    role="toolbar"
  >
    {discoveryLink ? (
      <OpenInCozyButton href={discoveryLink} t={t} />
    ) : (
      <CozyHomeLink from="sharing-drive" t={t} />
    )}
    <MoreMenu
      isFile={isFile}
      hasWriteAccess={hasWriteAccess}
      refreshFolderContent={refreshFolderContent}
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
    <BarRight>
      <div />
    </BarRight>
  </div>
)

DesktopToolbar.contextTypes = {
  t: PropTypes.func.isRequired
}

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
      const { client } = this.props
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
      logger.warn('Failed to load sharing discovery link', err)
    }
  }

  downloadFiles = () => {
    downloadFiles(this.props.client, this.props.files)
  }

  render() {
    const {
      breakpoints: { isMobile },
      renderInBar = false,
      isFile,
      hasWriteAccess,
      refreshFolderContent
    } = this.props
    const { discoveryLink } = this.state

    if (isMobile) {
      return (
        <MobileToolbar
          onDownload={this.downloadFiles}
          discoveryLink={discoveryLink}
          isFile={isFile}
          hasWriteAccess={hasWriteAccess}
          refreshFolderContent={refreshFolderContent}
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
          hasWriteAccess={hasWriteAccess}
          refreshFolderContent={refreshFolderContent}
        />
      )
    }
  }
}
PublicToolbar.propTypes = {
  isFile: PropTypes.bool.isRequired,
  renderInBar: PropTypes.bool,
  breakpoints: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  hasWriteAccess: PropTypes.bool,
  refreshFolderContent: PropTypes.func.isRequired
}

export default withClient(withBreakpoints()(PublicToolbar))
