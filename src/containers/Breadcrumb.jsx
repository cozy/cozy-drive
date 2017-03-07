import styles from '../styles/breadcrumb'

import { ROOT_DIR_ID, TRASH_DIR_ID, TRASH_CONTEXT } from '../constants/config'

import React from 'react'
import withState from 'cozy-ui/react/helpers/withState'
import { translate } from '../lib/I18n'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { openFolder } from '../actions'
import classNames from 'classnames'
import Spinner from '../components/Spinner'

const Breadcrumb = ({ t, context, folder, opening, deployed, toggleOpening, toggleDeploy, goToFolder }) => {
  if (!context) {
    return null
  }

  let isBrowsingTrash = context === TRASH_CONTEXT

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
            <Link
              to={`/${context}/${folder.id}`}
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
            </Link>
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
  context: state.context
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: (parentId, context) => dispatch(openFolder(parentId, context))
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
  },
}))(Breadcrumb)))
