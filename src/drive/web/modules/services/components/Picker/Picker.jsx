import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IntentHeader, Button, withBreakpoints } from 'cozy-ui/transpiled/react'
import { ROOT_DIR_ID } from 'drive/constants/config'
import Topbar from 'drive/web/modules/layout/Topbar'
import FileList from 'drive/web/modules/filelist/FileList'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb/Breadcrumb'
import PreviousButton from 'drive/web/modules/navigation/Breadcrumb/PreviousButton'
import { connect } from 'react-redux'
import withReduxStore from './withReduxStore'
import AddFolderButton from './AddFolderButton'
import OriginHint from './OriginHint'

import styles from './picker.styl'

class Picker extends Component {
  state = {
    path: []
  }
  static contextTypes = {
    t: PropTypes.func.isRequired
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
    this.headerIcon = data.cozyIconPath

    this.navigateTo({ id: ROOT_DIR_ID, name: 'Drive' })
  }

  cancelIntent = () => {
    this.props.service.cancel()
  }

  terminateIntent = () => {
    this.props.service.terminate({ id: this.props.openedFolderId })
  }

  render() {
    const {
      files,
      service,
      breakpoints: { isMobile }
    } = this.props
    const { path } = this.state
    const { t } = this.context
    const { hint, icon } = service.getData()
    const showBackButton = path.length > 1 && isMobile

    const folders = files.filter(file => file.type === 'directory')

    return (
      <div className={styles['wrapper']}>
        <IntentHeader
          appName="Drive"
          appEditor="Cozy"
          appIcon={this.headerIcon}
        />
        {hint && <OriginHint title={hint} icon={icon} />}
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
          files={folders}
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
