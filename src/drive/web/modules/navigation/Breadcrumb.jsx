/* global __TARGET__ cozy */
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Spinner from 'cozy-ui/react/Spinner'
import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'
import { withBreakpoints } from 'cozy-ui/react'
import { SharedDocuments } from 'sharing'

import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import {
  openFolder,
  getFolderPath,
  getFolderUrl
} from 'drive/web/modules/navigation/duck'

import styles from 'drive/styles/breadcrumb'

const renamePathNames = (path, location, t) => {
  if (location.pathname === '/recent') {
    path.unshift({
      name: t('breadcrumb.title_recent')
    })
  } else if (location.pathname.match(/^\/sharings/)) {
    path.unshift({
      name: t('breadcrumb.title_sharings'),
      url: '/sharings'
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

export class Breadcrumb extends Component {
  state = {
    deployed: false
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

  handleClickOutside = e => {
    if (this.menu && !this.menu.contains(e.target)) {
      e.stopPropagation()
      this.closeMenu()
    }
  }

  render() {
    const { path, onBreadcrumbClick, opening, className = '' } = this.props
    const { deployed } = this.state

    if (!path) return false

    return (
      <div
        className={classNames(
          styles['fil-path-backdrop'],
          { [styles['deployed']]: deployed },
          { [styles['mobile']]: __TARGET__ === 'mobile' },
          className
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
                <span
                  className={styles['fil-path-link']}
                  onClick={e => onBreadcrumbClick(folder)}
                >
                  <span className={styles['fil-path-link-name']}>
                    {folder.name}
                  </span>
                  <Icon
                    icon="forward"
                    className={styles['fil-path-separator']}
                  />
                </span>
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
    )
  }
}

class RouterBreadCrumb extends Component {
  state = {
    opening: false
  }

  toggleOpening = () => {
    this.setState(state => ({ opening: !state.opening }))
  }

  navigateToFolder = folderId => {
    const { router, location, goToFolder, getFolderUrl } = this.props

    this.toggleOpening()

    goToFolder(folderId).then(() => {
      this.toggleOpening()
      router.push(getFolderUrl(folderId, location))
    })
  }

  navigateToPath = path => {
    const { router } = this.props
    router.push(path)
  }

  navigateTo = folder => {
    if (folder.id) this.navigateToFolder(folder.id)
    else this.navigateToPath(folder.url)
  }

  render() {
    const { path } = this.props
    const { opening } = this.state

    return (
      <Breadcrumb
        path={path}
        onBreadcrumbClick={this.navigateTo}
        opening={opening}
      />
    )
  }
}

class PreviousButton extends Component {
  navigateToFolder = folderId => {
    const { router, location, goToFolder, getFolderUrl } = this.props
    goToFolder(folderId).then(() => {
      router.push(getFolderUrl(folderId, location))
    })
  }

  navigateToPath = path => {
    const { router } = this.props
    router.push(path)
  }

  render({ location, path }) {
    const previousSegment = path[path.length - 2]
    return (
      <button
        className={styles['fil-path-previous']}
        onClick={() =>
          previousSegment.id
            ? this.navigateToFolder(previousSegment.id)
            : this.navigateToPath(previousSegment.url)
        }
      />
    )
  }
}

const MobileAwareBreadcrumb = props => {
  const { BarCenter, BarLeft } = cozy.bar

  return props.breakpoints.isMobile ? (
    <div>
      {props.path.length >= 2 && (
        <BarLeft>
          <PreviousButton {...props} />
        </BarLeft>
      )}
      <BarCenter>
        <RouterBreadCrumb {...props} />
      </BarCenter>
    </div>
  ) : (
    <RouterBreadCrumb {...props} />
  )
}

const mapStateToProps = (state, ownProps) => ({
  path: renamePathNames(
    getFolderPath(
      state,
      ownProps.location,
      ownProps.isPublic,
      ownProps.sharedDocuments
    ),
    ownProps.location,
    ownProps.t
  ),
  getFolderUrl
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFolder: folderId => dispatch(openFolder(folderId))
})

const withSharedDocuments = Wrapped =>
  class extends React.Component {
    render() {
      return (
        <SharedDocuments>
          {({ sharedDocuments }) => (
            <Wrapped sharedDocuments={sharedDocuments} {...this.props} />
          )}
        </SharedDocuments>
      )
    }
  }

export default withBreakpoints()(
  withRouter(
    translate()(
      withSharedDocuments(
        connect(mapStateToProps, mapDispatchToProps)(MobileAwareBreadcrumb)
      )
    )
  )
)
