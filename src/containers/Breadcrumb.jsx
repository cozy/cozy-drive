import styles from '../styles/breadcrumb'

import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config'

import React from 'react'
import withState from 'cozy-ui/react/helpers/withState'
import { translate } from '../lib/I18n'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { openFolder } from '../actions'
import classNames from 'classnames'
import Spinner from '../components/Spinner'

import { getUrlFromParams } from '../reducers'

const Breadcrumb = ({ t, router, virtualRoot, folder, opening, deployed, toggleOpening, toggleDeploy, goToFolder }) => {
  if (!virtualRoot || !folder) {
    return null
  }

  let isBrowsingTrash = virtualRoot === TRASH_DIR_ID

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
      // since we don't *actually* have any information about the parent's parent, we have to fake it
      path.unshift({ id: parent.dir_id })
    }
  }

  // finally, we need to make sure we have the root level folder, which can be either the root, or the trash folder. While we're at it, we also rename the folders when we need to.
  let hasRootFolder = false
  path.forEach(folder => {
    if (folder.id === ROOT_DIR_ID) {
      folder.name = t('breadcrumb.title_files')
      hasRootFolder = true
    } else if (folder.id === TRASH_DIR_ID) {
      folder.name = t('breadcrumb.title_trash')
      if (isBrowsingTrash) hasRootFolder = true
    }

    if (!folder.name) folder.name = '…'
  })

  if (!hasRootFolder) {
    // if we don't have one, we add it manually
    path.unshift({
      id: isBrowsingTrash ? TRASH_DIR_ID : ROOT_DIR_ID,
      name: isBrowsingTrash ? t('breadcrumb.title_trash') : t('breadcrumb.title_files')
    })
  }

  return (
    <div
      className={classNames(styles['fil-path-backdrop'], {[styles['deployed']]: deployed})}
      onClick={toggleDeploy}
    >
      {path.length >= 2 &&
        <Link
          to={getUrlFromParams({ virtualRoot, displayedFolder: path[path.length - 2] })}
          className={styles['fil-path-previous']}
          onClick={e => {
            e.preventDefault()
            toggleOpening()
            if (deployed) toggleDeploy()
            goToFolder(virtualRoot, path[path.length - 2].id).then(() => {
              toggleOpening()
              router.push(getUrlFromParams({ virtualRoot, displayedFolder: path[path.length - 2] }))
            })
          }}
        />
      }
      <h2 className={styles['fil-path-title']}>

        { path.map((folder, index) => {
          if (index < path.length - 1) {
            return <Link
              to={getUrlFromParams({ virtualRoot, displayedFolder: folder })}
              className={styles['fil-path-link']}
              onClick={e => {
                e.preventDefault()
                toggleOpening()
                if (deployed) toggleDeploy()
                goToFolder(virtualRoot, folder.id).then(() => {
                  toggleOpening()
                  router.push(getUrlFromParams({ virtualRoot, displayedFolder: folder }))
                })
              }}
            >
              <a>
                { folder.name }
              </a>
              <span className={styles['fil-path-separator']}>/</span>
            </Link>
          } else {
            return <span
              className={styles['fil-path-current']}
              onClick={e => {
                e.stopPropagation()
                if (path.length >= 2) toggleDeploy()
              }}
            >
              { folder.name }
              {path.length >= 2 &&
                <span className={styles['fil-path-down']} />
              }

              { opening && <Spinner /> }
            </span>
          }
        }) }

      </h2>
    </div>
  )
}

const mapStateToProps = (state) => ({
  folder: state.view.displayedFolder,
  virtualRoot: state.view.virtualRoot
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: (virtualRoot, parentId) => dispatch(openFolder(virtualRoot, parentId))
})

export default translate()(connect(
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
  }
}))(withRouter(Breadcrumb))))
