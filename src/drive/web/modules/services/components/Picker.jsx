import React, { Component } from 'react'
import { Spinner, IntentHeader, Button } from 'cozy-ui/react'
import { ROOT_DIR_ID } from 'drive/constants/config'
import Main from 'drive/web/modules/Layout/Main'
import Topbar from 'drive/web/modules/Layout/Topbar'
import AsyncBoundary from 'drive/web/modules/navigation/AsyncBoundary'
import FileList from 'drive/web/modules/filelist/FileList'
import { Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb'
import configureStore from 'drive/store/configureStore'
import { Provider, connect } from 'react-redux'
import { showNewFolderInput } from 'drive/web/modules/filelist/duck'
import {
  openFolder,
  getOpenedFolderId,
  getVisibleFiles
} from 'drive/web/modules/navigation/duck'
import styles from './picker.styl'

export const withReduxStore = WrappedComponent => {
  class WithReduxStore extends Component {
    render() {
      const { client, t } = this.context
      const store = configureStore(client, t)

      return (
        <Provider store={store}>
          <WrappedComponent {...this.props} />
        </Provider>
      )
    }
  }
  WithReduxStore.displayName = `WithReduxStore(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`
  return WithReduxStore
}

const AddFolderButton = ({ addFolder }) => (
  <Button onClick={addFolder}>Nouveau dossier</Button>
)

const mapDispatchToPropsButton = (dispatch, ownProps) => ({
  addFolder: () => dispatch(showNewFolderInput())
})

const ConnectedAddFolderButton = connect(null, mapDispatchToPropsButton)(
  AddFolderButton
)

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
        <Topbar>
          <Breadcrumb
            path={this.state.path}
            onBreadcrumbClick={this.navigateTo}
            opening={false}
          />
          <ConnectedAddFolderButton />
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
