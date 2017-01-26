import styles from '../styles/breadcrumb'

import React from 'react'
import { translate } from '../lib/I18n'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { openFolder } from '../actions'
import classNames from 'classnames'
import Spinner from '../components/Spinner'

const Breadcrumb = ({ t, router, folder, folderId, opening, goToFolder }) => {
  const isRoot = !folder.dir_id
  const isInRoot = folder.parent && !folder.parent.dir_id
  const isLevel2 = folder.parent && folder.parent.dir_id

  return (
    <h2 class={styles['fil-content-title']}>

      { isRoot && // Displays 'Files' as the current folder
        <span>{ t(`breadcrumb.title_files`)}</span> }

      { !isRoot && // Display 'Files /' as the root folder
      <span
        className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
        onClick={() => goToFolder()}
        >
          { t(`breadcrumb.title_files`)} /
      </span>
      }

      { !isRoot && isLevel2 && (folder.parent.dir_id !== folderId) &&
        <span className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}> ... / </span> }

      { !isRoot && !isInRoot && folder.parent && // Displays the parent folder
        <span
          className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
          onClick={() => goToFolder(folder.parent.id)}
        >
          {folder.parent.name} /
        </span>
      }

      { !isRoot && // Displays the current folder
        <span>{folder.name}</span>}

      { (opening === folder.dir_id || opening === folderId) && <Spinner /> }

    </h2>
  )
}

const mapStateToProps = (state) => ({
  folder: state.folder,
  opening: state.ui.opening
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: (parentId) => {
    dispatch(openFolder(parentId, false, ownProps.router))
  }
})

export default translate()(connect(
  mapStateToProps, mapDispatchToProps)(withRouter(Breadcrumb)))
