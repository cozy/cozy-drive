import React, { Component } from 'react'
import { Spinner, IntentHeader, Button } from 'cozy-ui/react'
import { ROOT_DIR_ID } from 'drive/constants/config'
import Main from 'drive/web/modules/Layout/Main'
import Topbar from 'drive/web/modules/Layout/Topbar'
import AsyncBoundary from 'drive/web/modules/navigation/AsyncBoundary'
import FileList from 'drive/web/modules/filelist/FileList'
import { Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb'
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
    path: []
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

  componentDidMount() {
    this.navigateTo({ id: ROOT_DIR_ID, name: 'Drive' })
  }

  render() {
    const { files } = this.props

    return (
      <div className={styles['wrapper']}>
        <IntentHeader appName="Drive" appEditor="Cozy" />
        <Topbar hideOnMobile={false}>
          <Breadcrumb
            path={this.state.path}
            onBreadcrumbClick={this.navigateTo}
            opening={false}
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
          <Button theme="secondary">Annuler</Button>
          <Button>Sélectionner</Button>
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
  connect(mapStateToProps, mapDispatchToProps)(Picker)
)
