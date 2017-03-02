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

const Breadcrumb = ({ t, router, folder, opening, deployed, toggleOpening, toggleDeploy, isBrowsingTrash, goToFolder }) => {
  // reconstruct the whole path to the current folder (first element is the root, the last is the current folder)
  let path = []

  // dring the first fetch, folder is an empty object, and we don't want to display anything
  if (folder.id) path.push(folder)

  // does the folder have parents to display? The trash folder has the root folder as parent, but we don't want to show that.
  let parent = folder.parent
  if (parent && parent.id && !(isBrowsingTrash && parent.id === ROOT_DIR_ID)) {
    path.unshift(parent)

    // has the parent a parent too?
    if (parent.dir_id && !(isBrowsingTrash && parent.dir_id === ROOT_DIR_ID)) {
      // since we don't have *actually* any information about the parent's parent, we have to fake it
      path.unshift({ id: parent.dir_id })
    }
  }

  // finally, we need to make sure we have the root level folder, which can be either the root, or the trash folder. While we're at it, we also rename the folders when we need to.
  let hasRootFolder = false
  path.forEach(folder => {
    if (folder.id === ROOT_DIR_ID) {
      folder.name = t('breadcrumb.title_files')
      hasRootFolder = true
    }
    else if (folder.id === TRASH_DIR_ID) {
      folder.name = t('breadcrumb.title_trash')
      if (isBrowsingTrash) hasRootFolder = true
    }

    if (!folder.name) folder.name = '…'
  })

  if (!hasRootFolder) {
    //if we don't have one, we add it manually
    path.unshift({
      id: isBrowsingTrash ? TRASH_DIR_ID : ROOT_DIR_ID,
      name: isBrowsingTrash ? t('breadcrumb.title_trash') : t('breadcrumb.title_files')
    })
  }

  return (
    <div
      className={classNames(styles['fil-content-backdrop'], {[styles['deployed']]: deployed})}
      onClick={toggleDeploy}
    >
      {path.length >= 2 &&
        <button
          className={styles['fil-content-previous']}
          onClick={e => {
            e.stopPropagation()
            toggleOpening()
            if(deployed) toggleDeploy()
            goToFolder(path[path.length - 2].id).then(() => toggleOpening())
          }}
        />
      }
      <h2 className={styles['fil-content-title']}>

        { path.map((folder, index) => {
          if (index < path.length - 1) return (
            <span
              className={styles['fil-inside-path']}
              onClick={e => {
                e.stopPropagation()
                toggleOpening()
                if(deployed) toggleDeploy()
                goToFolder(folder.id).then(() => toggleOpening())
              }}
            >
              <a>
                { folder.name }
              </a>
              <span className={styles['separator']}>/</span>
            </span>
          )
          else return (
            <span
              className={styles['fil-main-path']}
              onClick={e => {
                e.stopPropagation()
                if (path.length >= 2) toggleDeploy()
              }}
            >
              { folder.name }
              {path.length >= 2 &&
                <span className={styles['fil-content-down']} />
              }

              { opening && <Spinner /> }
            </span>
          )
        }) }

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
  opening: false,
  deployed: false
}, (setState) => ({
  toggleOpening: () => {
    setState(state => ({ opening: !state.opening }))
  },
  toggleDeploy: () => {
    setState(state => ({ deployed: !state.deployed }))
  },
}))(Breadcrumb))))
