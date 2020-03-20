/* global __TARGET__ */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Icon from 'cozy-ui/transpiled/react/Icon'

import styles from 'drive/web/modules/navigation/Breadcrumb/breadcrumb.styl'

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
    const {
      path,
      onBreadcrumbClick,
      opening,
      inlined,
      className = ''
    } = this.props
    const { deployed } = this.state

    if (!path) return false

    return (
      <div
        className={cx(
          styles['fil-path-backdrop'],
          { [styles['deployed']]: deployed },
          { [styles['inlined']]: inlined },
          { [styles['mobile']]: __TARGET__ === 'mobile' },
          className
        )}
      >
        <h2
          data-test-id="path-title"
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
                  onClick={e => {
                    e.stopPropagation()
                    onBreadcrumbClick(folder)
                  }}
                  key={index}
                >
                  <span className={styles['fil-path-link-name']}>
                    {folder.name}
                  </span>
                  <Icon icon="right" className={styles['fil-path-separator']} />
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
                  key={index}
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

Breadcrumb.propTypes = {
  path: PropTypes.array,
  onBreadcrumbClick: PropTypes.func,
  opening: PropTypes.bool,
  inlined: PropTypes.bool,
  className: PropTypes.string
}

export default Breadcrumb
