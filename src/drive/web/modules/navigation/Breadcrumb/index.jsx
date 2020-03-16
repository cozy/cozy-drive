import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import SharedDocuments from 'cozy-sharing/dist/components/SharedDocuments'

import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import { openFolder, getFolderUrl } from 'drive/web/modules/navigation/duck'
import getFolderPath from './getFolderPath'
import MobileAwareBreadcrumb from './MobileAwareBreadcrumb'

import Breadcrumb from './Breadcrumb'
import PreviousButton from './PreviousButton'

export { Breadcrumb, PreviousButton }

export const renamePathNames = (path, pathname, t) => {
  if (pathname === '/recent') {
    path.unshift({
      name: t('breadcrumb.title_recent')
    })
  } else if (pathname.match(/^\/sharings/)) {
    path.unshift({
      name: t('breadcrumb.title_sharings'),
      url: '/sharings'
    })
  }

  path.forEach(folder => {
    if (folder.id === ROOT_DIR_ID) {
      folder.name = t('breadcrumb.title_drive')
    } else if (folder.id === TRASH_DIR_ID) {
      folder.name = t('breadcrumb.title_trash')
    }
    if (!folder.name) folder.name = '…'
  })

  return path
}

const mapStateToProps = (state, ownProps) => ({
  path: renamePathNames(
    getFolderPath(
      state.view.displayedFolder,
      state.view.currentView,
      ownProps.isPublic,
      ownProps.sharedDocuments
    ),
    ownProps.location.pathname,
    ownProps.t
  ),
  getFolderUrl
})

const mapDispatchToProps = dispatch => ({
  goToFolder: folderId => dispatch(openFolder(folderId, 'ACTION_SUCCESS'))
})

const withSharedDocuments = Wrapped =>
  class withSharedDocumentsClass extends React.Component {
    render() {
      return (
        <SharedDocuments>
          {({ sharedDocuments }) => (
            <Wrapped sharedDocuments={sharedDocuments} {...this.props} />
          )}
        </SharedDocuments>
      )
    }
  }

export default withBreakpoints()(
  withRouter(
    translate()(
      withSharedDocuments(
        connect(
          mapStateToProps,
          mapDispatchToProps
        )(MobileAwareBreadcrumb)
      )
    )
  )
)
