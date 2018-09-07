import React, { Component } from 'react'
import { IntentHeader, Button, withBreakpoints } from 'cozy-ui/react'
import { ROOT_DIR_ID } from 'drive/constants/config'
import Topbar from 'drive/web/modules/Layout/Topbar'
import FileList from 'drive/web/modules/filelist/FileList'
import {
  Breadcrumb,
  PreviousButton
} from 'drive/web/modules/navigation/Breadcrumb'
import { connect } from 'react-redux'
import withReduxStore from './withReduxStore'
import AddFolderButton from './AddFolderButton'
import {
  openFolder,
  getOpenedFolderId,
  getVisibleFiles
} from 'drive/web/modules/navigation/duck'
import styles from './picker.styl'

class Picker extends Component {
  state = {
    path: [],
    headerIcon: ''
  }

  updateBreadcrumb = folder => {
    this.setState(state => {
      const indexInPath = state.path.indexOf(folder)
      const newPath =
        indexInPath >= 0
          ? state.path.slice(0, indexInPath + 1)
          : [...state.path, folder]

      return {
        ...state,
        path: newPath
      }
    })
  }

  navigateTo = folder => {
    this.props.fetchFolder(folder.id)
    this.updateBreadcrumb(folder)
  }

  goBack = () => {
    const { path } = this.state
    this.navigateTo(path[path.length - 2])
  }

  componentDidMount() {
    const root = document.getElementById('main')
    const data = root.dataset
    this.setState({ headerIcon: data.cozyIconPath })

    this.navigateTo({ id: ROOT_DIR_ID, name: 'Drive' })
  }

  cancelIntent = () => {
    this.props.service.cancel()
  }

  terminateIntent = () => {
    this.props.service.terminate({ id: this.props.openedFolderId })
  }

  render() {
    const { files, breakpoints: { isMobile } } = this.props
    const { headerIcon, path } = this.state
    const { t } = this.context
    const showBackButton = path.length > 1 && isMobile

    return (
      <div className={styles['wrapper']}>
        <IntentHeader appName="Drive" appEditor="Cozy" appIcon={headerIcon} />
        <Topbar hideOnMobile={false}>
          {showBackButton && <PreviousButton onClick={this.goBack} />}
          <Breadcrumb
            path={this.state.path}
            onBreadcrumbClick={this.navigateTo}
            opening={false}
            className={styles['breadcrumb']}
          />
          <div className={styles['toolbar']} role="toolbar">
            <AddFolderButton />
          </div>
        </Topbar>
        <FileList
          withSelectionCheckbox={false}
          canSort={false}
          fileActions={[]}
          files={files}
          selectionModeActive={false}
          actionMenuActive={false}
          onFolderOpen={id => this.navigateTo(files.find(f => f.id === id))}
        />
        <div className={styles['button-area']}>
          <Button theme="secondary" onClick={this.cancelIntent}>
            {t('intents.picker.cancel')}
          </Button>
          <Button onClick={this.terminateIntent}>
            {t('intents.picker.select')}
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  openedFolderId: getOpenedFolderId(state),
  files: getVisibleFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchFolder: folderId => dispatch(openFolder(folderId))
})

export default withReduxStore(
  connect(mapStateToProps, mapDispatchToProps)(withBreakpoints()(Picker))
)
