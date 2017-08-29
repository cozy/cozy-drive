/* global __TARGET__ */
import styles from '../styles/breadcrumb'

import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config'

import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { openFolder } from '../actions'
import classNames from 'classnames'
import Spinner from 'cozy-ui/react/Spinner'

import { getFolderPath, getFolderUrl } from '../reducers'

class Breadcrumb extends Component {
  state = {
    opening: false,
    deployed: false
  }

  toggleOpening = () => {
    this.setState(state => ({ opening: !state.opening }))
  }

  toggleDeploy = () => {
    this.state.deployed ? this.closeMenu() : this.openMenu()
  }

  openMenu () {
    this.setState({ deployed: true })
    document.addEventListener('click', this.handleClickOutside, true)
  }

  closeMenu () {
    this.setState({ deployed: false })
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  handleClick = (e, folderId, animate) => {
    const { router, location, goToFolder, getFolderUrl } = this.props
    e.preventDefault()
    if (animate) {
      this.toggleOpening()
      if (this.state.deployed) this.toggleDeploy()
    }
    goToFolder(folderId).then(() => {
      if (animate) {
        this.toggleOpening()
        this.toggleDeploy()
      }
      router.push(getFolderUrl(folderId, location))
    })
  }

  handleClickOutside = e => {
    if (!this.menu.contains(e.target)) {
      e.stopPropagation()
      this.closeMenu()
    }
  }

  render () {
    const { t, location, path } = this.props
    const { opening, deployed } = this.state
    if (!path) {
      return null
    }

    path.forEach(folder => {
      if (folder.id === ROOT_DIR_ID) {
        folder.name = t('breadcrumb.title_drive')
      } else if (folder.id === TRASH_DIR_ID) {
        folder.name = t('breadcrumb.title_trash')
      }
      if (!folder.name) folder.name = '…'
    })

    return (
      <div
        className={classNames(
          styles['fil-path-backdrop'],
          {[styles['deployed']]: deployed},
          {[styles['mobile']]: __TARGET__ === 'mobile'}
        )}
      >
        {path.length >= 2 &&
          <Link
            to={getFolderUrl(path[path.length - 2].id, location)}
            className={styles['fil-path-previous']}
            onClick={e => this.handleClick(e, path[path.length - 2].id, false)}
          />
        }
        <h2 className={styles['fil-path-title']}
          onClick={this.toggleDeploy}
          ref={ref => { this.menu = ref }}
        >
          { path.map((folder, index) => {
            if (index < path.length - 1) {
              return (
                <Link
                  to={getFolderUrl(folder.id, location)}
                  className={styles['fil-path-link']}
                  onClick={e => this.handleClick(e, folder.id, true)}
                >
                  <a>
                    { folder.name }
                  </a>
                  <span className={styles['fil-path-separator']}>/</span>
                </Link>
              )
            } else {
              return (
                <span
                  className={styles['fil-path-current']}
                  onClick={e => {
                    e.stopPropagation()
                    if (path.length >= 2) this.toggleDeploy()
                  }}
                >
                  <span className={styles['fil-path-current-name']}>
                    { folder.name }
                  </span>
                  {path.length >= 2 &&
                    <span className={styles['fil-path-down']} />
                  }

                  { opening && <Spinner /> }
                </span>
              )
            }
          }) }

        </h2>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  path: getFolderPath(state, ownProps.location, ownProps.isPublic),
  getFolderUrl
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: folderId => dispatch(openFolder(folderId))
})

export default withRouter(translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumb)))
