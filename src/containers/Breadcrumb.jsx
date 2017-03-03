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

const Breadcrumb = ({ t, context, folder, opening, toggle, goToFolder }) => {
  if (!context) {
    return null
  }

  const topLevelTitle = t(`breadcrumb.title_${context}`)

  if (!folder) {
    return (
      <h2 class={styles['fil-content-title']}>
        <span>{ topLevelTitle }</span>
      </h2>
    )
  }

  const isRoot = folder.id === ROOT_DIR_ID
  const isTrash = folder.id === TRASH_DIR_ID

  const isInRoot = folder.parent && folder.parent.id === ROOT_DIR_ID
  const isInTrash = folder.parent && folder.parent.id === TRASH_DIR_ID

  const showParentFolder = !isRoot && !isTrash && !isInRoot && !isInTrash && folder.parent

  const isLevel2Root = folder.parent && folder.parent.dir_id && folder.parent.dir_id !== ROOT_DIR_ID
  const isLevel2Trash = folder.parent && folder.parent.dir_id && folder.parent.dir_id !== TRASH_DIR_ID && !isInTrash

  const isBrowsingTrash = context === TRASH_CONTEXT

  const showEllipsis = (isBrowsingTrash && isLevel2Trash) || (!isBrowsingTrash && isLevel2Root)

  return (
    <h2 class={styles['fil-content-title']}>

      { (isRoot || isTrash) && // Displays the non-interactive root folder
        <span>{ topLevelTitle }</span> }

      { !isRoot && !isTrash && // show the interactive root folder
        <Link
          to={`/${context}`}
          className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
          onClick={() => {
            toggle()
            goToFolder(null, context).then(() => toggle())
          }}
        >
          { topLevelTitle }
          <span className={styles['separator']}>/</span>
        </Link>
      }

      { showEllipsis && // show an ellipsis if there are more than 2 levels
        <span className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}>
          …
          <span className={styles['separator']}>/</span>
        </span> }

      { showParentFolder && // Displays the parent folder
        <Link
          to={`/${context}/${folder.parent.id}`}
          className={classNames(styles['fil-inside-path'], styles['fil-path-hidden'])}
          onClick={() => {
            toggle()
            goToFolder(folder.parent.id, context).then(() => toggle())
          }}
        >
          {folder.parent.name}
          <span className={styles['separator']}>/</span>
        </Link>
      }

      { !isRoot && !isTrash && // Displays the current folder
        <span>{folder.name}</span>}

      { opening && <Spinner /> }

    </h2>
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
  opening: false
}, (setState) => ({
  toggle: () => {
    setState(state => ({ opening: !state.opening }))
  }
}))(Breadcrumb)))
