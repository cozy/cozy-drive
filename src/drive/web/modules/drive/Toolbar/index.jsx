/* global cozy */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import cx from 'classnames'

import { withClient } from 'cozy-client'
import SharingProvider, { SharedDocument } from 'cozy-sharing'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'
import { useWebviewIntent } from 'cozy-intent'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import { getCurrentFolderId } from 'drive/web/modules/selectors'

import AddButton from 'drive/web/modules/drive/Toolbar/components/AddButton'
import InsideRegularFolder from 'drive/web/modules/drive/Toolbar/components/InsideRegularFolder'
import MoreMenu from 'drive/web/modules/drive/Toolbar/components/MoreMenu'
import ShareButton from 'drive/web/modules/drive/Toolbar/share/ShareButton'
import SharedRecipients from 'drive/web/modules/drive/Toolbar/share/SharedRecipients'
import AddMenuProvider from 'drive/web/modules/drive/AddMenu/AddMenuProvider'

import styles from 'drive/styles/toolbar.styl'

class Toolbar extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static defaultProps = {
    canUpload: false,
    canCreateFolder: false,
    hasWriteAccess: false
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.disabled !== this.props.disabled ||
      nextProps.selectionModeActive !== this.props.selectionModeActive ||
      nextProps.canUpload !== this.props.canUpload ||
      nextProps.canCreateFolder !== this.props.canCreateFolder ||
      nextProps.hasWriteAccess !== this.props.hasWriteAccess ||
      nextProps.isShared !== this.props.isShared ||
      nextProps.breakpoints.isMobile !== this.props.breakpoints.isMobile
    ) {
      return true
    }
    return false
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
      breakpoints: { isMobile },
      client,
      webviewService
    } = this.props

    const isDisabled = disabled || selectionModeActive
    if (disabled) {
      return null
    }
    const { BarRight } = cozy.bar

    return (
      <div
        data-testid="fil-toolbar-files"
        className={cx(styles['fil-toolbar-files'], 'u-flex-items-center')}
        role="toolbar"
      >
        <InsideRegularFolder>
          <SharedRecipients />
        </InsideRegularFolder>
        <InsideRegularFolder>
          <ShareButton isDisabled={isDisabled} />
        </InsideRegularFolder>

        {hasWriteAccess && (
          <AddMenuProvider
            canCreateFolder={canCreateFolder}
            canUpload={canUpload}
            disabled={isDisabled}
          >
            <AddButton />
          </AddMenuProvider>
        )}

        {isMobile ? (
          <BarRight>
            <BarContextProvider
              client={client}
              store={this.context.store}
              t={t}
              lang={lang}
              webviewService={webviewService}
            >
              <SharingProvider doctype="io.cozy.files" documentType="Files">
                <MoreMenu
                  isDisabled={isDisabled}
                  hasWriteAccess={hasWriteAccess}
                />
              </SharingProvider>
            </BarContextProvider>
          </BarRight>
        ) : (
          <MoreMenu isDisabled={isDisabled} hasWriteAccess={hasWriteAccess} />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  folderId: getCurrentFolderId(state),
  selectionModeActive: isSelectionBarVisible(state)
})

const ToolbarWithWebviewContext = props => {
  const webviewIntent = useWebviewIntent()

  return <Toolbar webviewService={webviewIntent} {...props} />
}

/**
 * Provides the Toolbar with sharing properties of the current folder.
 *
 * In views where the displayed folder is virtual (eg: Recent files, Sharings),
 * no sharing information is provided to the Toolbar.
 */
const ToolbarWithSharingContext = props => {
  return !props.folderId ? (
    <ToolbarWithWebviewContext {...props} />
  ) : (
    <SharedDocument docId={props.folderId}>
      {sharingProps => {
        const { hasWriteAccess } = sharingProps
        return (
          <ToolbarWithWebviewContext
            {...props}
            hasWriteAccess={hasWriteAccess}
          />
        )
      }}
    </SharedDocument>
  )
}

ToolbarWithSharingContext.displayName = 'ToolbarWithSharingContext'

export default compose(
  translate(),
  withClient,
  connect(mapStateToProps, null),
  withBreakpoints()
)(ToolbarWithSharingContext)
