import styles from '../styles/breadcrumb'

import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config'

import React from 'react'
import withState from 'cozy-ui/react/helpers/withState'
import { translate } from '../lib/I18n'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { openFolder } from '../actions'
import classNames from 'classnames'
import Spinner from '../components/Spinner'
import { isBrowsingTrash } from '../reducers'

const Breadcrumb = ({ t, router, folder, opening, toggle, isBrowsingTrash, goToFolder }) => {
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
    <div>
      <button className={styles['fil-content-previous']}>
      </button>
      <h2 className={styles['fil-content-title']}>

        { (isRoot || isTrash) && // Displays the non-interactive root folder
          <span>{ t(topLevelTitle) }</span> }

        { !isRoot && !isTrash && // show the interactive root folder
          <span
            className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
            onClick={() => {
              toggle()
              goToFolder(isBrowsingTrash ? TRASH_DIR_ID : ROOT_DIR_ID).then(() => toggle())
            }}
          >
            <a>{ t(topLevelTitle) }</a>
            <span className={styles['separator']}>/</span>
          </span>
        }

        { showEllipsis && // show an ellipsis if there are more than 2 levels
          <span className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}>
            …
            <span className={styles['separator']}>/</span>
          </span> }

        { showParentFolder && // Displays the parent folder
          <span
            className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
            onClick={() => {
              toggle()
              goToFolder(folder.parent.id).then(() => toggle())
            }}
          >
            <a>{folder.parent.name}</a>
            <span className={styles['separator']}>/</span>
          </span>
        }

        { !isRoot && !isTrash && // Displays the current folder
          <span>{folder.name}</span>}

        { opening && <Spinner /> }

      </h2>
    </div>
  )
}

const mapStateToProps = (state) => ({
  folder: state.folder,
  isBrowsingTrash: isBrowsingTrash(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: (parentId) => {
    return dispatch(openFolder(parentId, false, ownProps.router))
  }
})

export default translate()(withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withState({
  opening: false
}, (setState) => ({
  toggle: () => {
    setState(state => ({ opening: !state.opening }))
  }
}))(Breadcrumb))))
