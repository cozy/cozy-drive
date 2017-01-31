import styles from '../styles/breadcrumb'

import { ROOT_DIR_ID } from '../constants/config'

import React from 'react'
import { translate } from '../lib/I18n'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { openFolder } from '../actions'
import classNames from 'classnames'
import Spinner from '../components/Spinner'

const Breadcrumb = ({ t, router, folder, opening, goToFolder }) => {
  const isRoot = !folder.dir_id
  const isInRoot = folder.parent && !folder.parent.dir_id
  const isLevel2 = folder.parent && folder.parent.dir_id && folder.parent.dir_id !== ROOT_DIR_ID

  return (
    <h2 class={styles['fil-content-title']}>

      { isRoot && // Displays 'Files' as the current folder
        <span>{ t(`breadcrumb.title_files`)}</span> }

      { !isRoot && // Display 'Files /' as the root folder
      <span
        className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
        onClick={() => goToFolder()}
        > <a>{ t(`breadcrumb.title_files`)}</a> / </span>
      }

      { isLevel2 &&
        <span className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}> ... / </span> }

      { !isRoot && !isInRoot && folder.parent && // Displays the parent folder
        <span
          className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
          onClick={() => goToFolder(folder.parent.id)}
        >
          <a>{folder.parent.name}</a><span> / </span>
        </span>
      }

      { !isRoot && // Displays the current folder
        <span>{folder.name}</span>}

      { (opening === folder.dir_id || opening === folder.id) && <Spinner /> }

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

export default translate()(withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumb)))
