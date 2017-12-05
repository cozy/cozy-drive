/* global __TARGET__ cozy */
import styles from '../styles/breadcrumb'

import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config'

import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { openFolder } from '../actions'
import classNames from 'classnames'
import Spinner from 'cozy-ui/react/Spinner'
import { withBreakpoints } from 'cozy-ui/react'

import { getFolderPath, getFolderUrl } from '../reducers'

const { BarCenter, BarLeft } = cozy.bar

const renamePathNames = (path, location, t) => {
  if (location.pathname === '/recent') {
    path.unshift({
      name: t('breadcrumb.title_recent')
    })
  }

  path.forEach(folder => {
    if (folder.id === ROOT_DIR_ID) {
      folder.name = t('breadcrumb.title_drive')
    } else if (folder.id === TRASH_DIR_ID) {
      folder.name = t('breadcrumb.title_trash')
    }
    if (!folder.name) folder.name = '…'
  })

  return path
}

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

  openMenu() {
    this.setState({ deployed: true })
    document.addEventListener('click', this.handleClickOutside, true)
  }

  closeMenu() {
    this.setState({ deployed: false })
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  navigateToFolder = (e, folderId) => {
    const { router, location, goToFolder, getFolderUrl } = this.props
    e.preventDefault()

    this.toggleOpening()
    if (this.state.deployed) this.toggleDeploy()

    goToFolder(folderId).then(() => {
      this.toggleOpening()
      this.toggleDeploy()
      router.push(getFolderUrl(folderId, location))
    })
  }

  handleClickOutside = e => {
    if (!this.menu.contains(e.target)) {
      e.stopPropagation()
      this.closeMenu()
    }
  }

  render() {
    const { location, path } = this.props
    const { opening, deployed } = this.state

    return path ? (
      <div
        className={classNames(
          styles['fil-path-backdrop'],
          { [styles['deployed']]: deployed },
          { [styles['mobile']]: __TARGET__ === 'mobile' }
        )}
      >
        <h2
          className={styles['fil-path-title']}
          onClick={this.toggleDeploy}
          ref={ref => {
            this.menu = ref
          }}
        >
          {path.map((folder, index) => {
            if (index < path.length - 1) {
              return (
                <Link
                  to={getFolderUrl(folder.id, location)}
                  className={styles['fil-path-link']}
                  onClick={e => this.navigateToFolder(e, folder.id)}
                >
                  <a>{folder.name}</a>
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
                    {folder.name}
                  </span>
                  {path.length >= 2 && (
                    <span className={styles['fil-path-down']} />
                  )}

                  {opening && <Spinner />}
                </span>
              )
            }
          })}
        </h2>
      </div>
    ) : null
  }
}

class PreviousButton extends Component {
  navigateToFolder = folderId => {
    const { router, location, goToFolder, getFolderUrl } = this.props
    goToFolder(folderId).then(() => {
      router.push(getFolderUrl(folderId, location))
    })
  }

  render({ location, path }) {
    const previousFolderId = path[path.length - 2].id
    return (
      <button
        className={styles['fil-path-previous']}
        onClick={() => this.navigateToFolder(previousFolderId)}
      />
    )
  }
}

const MobileAwareBreadcrumb = props => {
  return props.breakpoints.isMobile ? (
    <div>
      {props.path.length >= 2 && (
        <BarLeft>
          <PreviousButton {...props} />
        </BarLeft>
      )}
      <BarCenter>
        <Breadcrumb {...props} />
      </BarCenter>
    </div>
  ) : (
    <Breadcrumb {...props} />
  )
}

const mapStateToProps = (state, ownProps) => ({
  path: renamePathNames(
    getFolderPath(state, ownProps.location, ownProps.isPublic),
    ownProps.location,
    ownProps.t
  ),
  getFolderUrl
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: folderId => dispatch(openFolder(folderId))
})

export default withBreakpoints()(
  withRouter(
    translate()(
      connect(mapStateToProps, mapDispatchToProps)(MobileAwareBreadcrumb)
    )
  )
)
