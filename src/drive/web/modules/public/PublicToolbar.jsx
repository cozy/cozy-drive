/* global cozy */
import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import logger from 'lib/logger'
import { withClient, useClient } from 'cozy-client'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'

import { MoreButton } from 'components/Button'
import DownloadButton from './DownloadButton'
import { downloadFiles } from 'drive/web/modules/navigation/duck'
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
import CreateNoteItem from 'drive/web/modules/drive/Toolbar/components/CreateNoteItem'
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
    reloadView,
    breakpoints: { isMobile }
  }) => {
    const anchorRef = React.createRef()
    const [menuIsVisible, setMenuVisible] = useState(false)

    const openMenu = useCallback(() => setMenuVisible(true))
    const closeMenu = useCallback(() => setMenuVisible(false))

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
                  onSelect={onOpenInCozy}
                  left={<Icon icon={'to-the-cloud'} />}
                >
                  {t('toolbar.menu_open_cozy')}
                </ActionMenuItem>
              )}
            {onCreateCozy &&
              isMobile && (
                <ActionMenuItem
                  onSelect={onCreateCozy}
                  left={<Icon icon={'cloud'} />}
                >
                  {t('Share.create-cozy')}
                </ActionMenuItem>
              )}
            <ActionMenuItem
              onSelect={onDownload}
              left={<Icon icon={DownloadIcon} />}
            >
              {isFile
                ? t('toolbar.menu_download_file')
                : t('toolbar.menu_download_folder')}
            </ActionMenuItem>
            {hasWriteAccess && <AddFolderItem />}
            {hasWriteAccess && <CreateNoteItem />}
            {hasWriteAccess && <CreateShortcut afterCreation={reloadView} />}
            {hasWriteAccess && <UploadItem afterUpload={reloadView} />}
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
  onOpenInCozy: PropTypes.func,
  onCreateCozy: PropTypes.func,
  isFile: PropTypes.bool.isRequired
}

const toolbarProptypes = {
  onDownload: PropTypes.func.isRequired,
  discoveryLink: PropTypes.string,
  isFile: PropTypes.bool.isRequired,
  hasWriteAccess: PropTypes.bool,
  reloadView: PropTypes.func.isRequired
}
const openExternalLink = url => (window.location = url)

const MobileToolbar = (
  { onDownload, discoveryLink, isFile, hasWriteAccess, reloadView },
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
          reloadView={reloadView}
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
  { onDownload, discoveryLink, isFile, hasWriteAccess, reloadView },
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
      reloadView={reloadView}
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
    this.props.onDownload(this.props.files)
  }

  render() {
    const {
      breakpoints: { isMobile },
      renderInBar = false,
      isFile,
      hasWriteAccess,
      reloadView
    } = this.props
    const { discoveryLink } = this.state

    if (isMobile) {
      return (
        <MobileToolbar
          onDownload={this.downloadFiles}
          discoveryLink={discoveryLink}
          isFile={isFile}
          hasWriteAccess={hasWriteAccess}
          reloadView={reloadView}
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
          reloadView={reloadView}
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
  reloadView: PropTypes.func.isRequired
}
const mapDispatchToProps = dispatch => ({
  onDownload: files => dispatch(downloadFiles(files))
})

export default withClient(
  connect(
    null,
    mapDispatchToProps
  )(withBreakpoints()(PublicToolbar))
)
