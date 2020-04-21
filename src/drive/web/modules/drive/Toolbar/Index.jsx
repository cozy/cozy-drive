/* global cozy */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import SharingProvider, { SharedDocument } from 'cozy-sharing'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'
import { withClient } from 'cozy-client'
import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/toolbar.styl'

import NotRootFolder from 'drive/web/modules/drive/Toolbar/components/NotRootFolder'

import UploadItem from './components/UploadItem'
import MoreMenu from './components/MoreMenu'

import ShareButton from './share/ShareButton'
import SharedRecipients from './share/SharedRecipients'

class Toolbar extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    const {
      t,
      lang,
      disabled,
      selectionModeActive,
      canUpload,
      canCreateFolder,
      hasWriteAccess,
      isShared,
      breakpoints: { isMobile },
      client
    } = this.props
    const isDisabled = disabled || selectionModeActive
    const { BarRight } = cozy.bar

    return (
      <div
        data-test-id="fil-toolbar-files"
        className={styles['fil-toolbar-files']}
        role="toolbar"
      >
        {!isShared &&
          canUpload &&
          hasWriteAccess && <UploadItem disabled={isDisabled} />}
        <NotRootFolder>
          <SharedRecipients />
        </NotRootFolder>
        <NotRootFolder>
          <ShareButton isDisabled={isDisabled} />
        </NotRootFolder>

        {isMobile ? (
          <BarRight>
            <BarContextProvider
              client={client}
              store={this.context.store}
              t={t}
              lang={lang}
            >
              <SharingProvider doctype="io.cozy.files" documentType="Files">
                <MoreMenu
                  isDisabled={isDisabled}
                  canCreateFolder={canCreateFolder}
                  canUpload={canUpload}
                  hasWriteAccess={hasWriteAccess}
                />
              </SharingProvider>
            </BarContextProvider>
          </BarRight>
        ) : (
          <MoreMenu
            isDisabled={isDisabled}
            canCreateFolder={canCreateFolder}
            canUpload={canUpload}
            hasWriteAccess={hasWriteAccess}
          />
        )}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  displayedFolder: state.view.displayedFolder,
  selectionModeActive: isSelectionBarVisible(state)
})

const ToolbarWithSharingContext = props =>
  !props.displayedFolder ? (
    <Toolbar {...props} />
  ) : (
    <SharedDocument docId={props.displayedFolder.id}>
      {({ isShared, hasWriteAccess }) => (
        <Toolbar
          {...props}
          hasWriteAccess={hasWriteAccess}
          isShared={isShared}
        />
      )}
    </SharedDocument>
  )
ToolbarWithSharingContext.displayName = 'ToolbarWithSharingContext'

export default compose(
  translate(),
  withClient,
  connect(
    mapStateToProps,
    null
  ),
  withBreakpoints()
)(ToolbarWithSharingContext)
