import styles from '../styles/breadcrumb'

import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config'

import React from 'react'
import { translate } from '../lib/I18n'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { openFolder } from '../actions'
import classNames from 'classnames'
import Spinner from '../components/Spinner'
import { isBrowsingTrash } from '../reducers'

const Breadcrumb = ({ t, router, folder, opening, isBrowsingTrash, goToFolder }) => {
  const isRoot = folder.id === ROOT_DIR_ID
  const isTrash = folder.id === TRASH_DIR_ID

  const isInRoot = folder.parent && folder.parent.id === ROOT_DIR_ID
  const isInTrash = folder.parent && folder.parent.id === TRASH_DIR_ID

  const showParentFolder = !isRoot && !isTrash && !isInRoot && !isInTrash && folder.parent

  const isLevel2Root = folder.parent && folder.parent.dir_id && folder.parent.dir_id !== ROOT_DIR_ID
  const isLevel2Trash = folder.parent && folder.parent.dir_id && folder.parent.dir_id !== TRASH_DIR_ID && !isInTrash

  const showEllipsis = (isBrowsingTrash && isLevel2Trash) || (!isBrowsingTrash && isLevel2Root)

  const topLevelTitle = isBrowsingTrash ? 'breadcrumb.title_trash' : 'breadcrumb.title_files'

  return (
    <h2 class={styles['fil-content-title']}>

      { (isRoot || isTrash) && // Displays the non-interactive root folder
        <span>{ t(topLevelTitle) }</span> }

      { !isRoot && !isTrash && // show the interactive root format
      <span
        className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
        onClick={() => goToFolder(isBrowsingTrash ? TRASH_DIR_ID : ROOT_DIR_ID)}
        >
          <a>{ t(topLevelTitle) }</a> /
        </span>
      }

      { showEllipsis && //show an ellipsis if there are more than 2 levels
        <span className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}>… /</span> }

      { showParentFolder && // Displays the parent folder
        <span
          className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
          onClick={() => goToFolder(folder.parent.id)}
        >
          <a>{folder.parent.name}</a> /
        </span>
      }

      { !isRoot && !isTrash && // Displays the current folder
        <span>{folder.name}</span>}

      { (opening === folder.dir_id || opening === folder.id) && <Spinner /> }

    </h2>
  )
}

const mapStateToProps = (state) => ({
  folder: state.folder,
  isBrowsingTrash: isBrowsingTrash(state),
  opening: state.ui.opening
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: (parentId) => {
    dispatch(openFolder(parentId, false, ownProps.router))
  }
})

export default translate()(withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumb)))
