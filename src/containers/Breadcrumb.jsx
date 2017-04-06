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

import { getFolderPath, getFolderUrl } from '../reducers'

const Breadcrumb = ({ t, router, location, path, opening, deployed, toggleOpening, toggleDeploy, goToFolder }) => {
  if (!path) {
    return null
  }

  path.forEach(folder => {
    if (folder.id === ROOT_DIR_ID) {
      folder.name = t('breadcrumb.title_files')
    } else if (folder.id === TRASH_DIR_ID) {
      folder.name = t('breadcrumb.title_trash')
    }
    if (!folder.name) folder.name = '…'
  })

  const onClick = folderId => e => {
    e.preventDefault()
    toggleOpening()
    if (deployed) toggleDeploy()
    goToFolder(folderId).then(() => {
      toggleOpening()
      router.push(getFolderUrl(folderId, location))
    })
  }

  return (
    <div
      className={classNames(styles['fil-path-backdrop'], {[styles['deployed']]: deployed})}
      onClick={toggleDeploy}
    >
      {path.length >= 2 &&
        <Link
          to={getFolderUrl(path[path.length - 2].id, location)}
          className={styles['fil-path-previous']}
          onClick={onClick(path[path.length - 2].id)}
        />
      }
      <h2 className={styles['fil-path-title']}>

        { path.map((folder, index) => {
          if (index < path.length - 1) {
            return <Link
              to={getFolderUrl(folder.id, location)}
              className={styles['fil-path-link']}
              onClick={onClick(folder.id)}
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

const mapStateToProps = (state, ownProps) => ({
  path: getFolderPath(state, ownProps.location)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: folderId => dispatch(openFolder(folderId))
})

export default withRouter(translate()(connect(
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
}))(Breadcrumb))))
