/* global __TARGET__ */

import styles from '../styles/nav'

import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import { withBreakpoints } from 'cozy-ui/react'

import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'

import Spinner from 'cozy-ui/react/Spinner'
import { openFiles, openTrash, openRecent } from '../actions'

class CustomLink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opening: false
    }
  }

  open(e) {
    e.preventDefault()
    this.setState({ opening: true })
    this.props.onActiveChange()
    this.props.onClick().then(() => {
      this.setState({ opening: false })
      this.props.onActiveChange()
      this.props.router.push(this.props.to)
    })
  }

  render() {
    const {
      router,
      location,
      to,
      activeClassName,
      breakpoints: { isMobile, isTablet },
      children,
      ...props
    } = this.props
    const { opening } = this.state

    props.href = router.createHref(to)

    if (activeClassName && location.pathname.match(new RegExp('^' + to))) {
      if (props.className) {
        props.className += ` ${activeClassName}`
      } else {
        props.className = activeClassName
      }
    }

    return (
      <a {...props} onClick={e => this.open(e)}>
        {children}
        {opening && (
          <Spinner
            className={styles['nav-spinner']}
            size={`${isMobile || isTablet ? 'tiny' : 'medium'}`}
          />
        )}
      </a>
    )
  }
}

const ActiveLink = withBreakpoints()(withRouter(CustomLink))

class Nav extends Component {
  state = {
    opening: false
  }

  toggleOpening = () => this.setState(state => ({ opening: !state.opening }))

  render() {
    const { t, openFiles, openRecent, openTrash } = this.props
    const { opening } = this.state
    return (
      <nav>
        <ul className={styles['coz-nav']}>
          <li className={styles['coz-nav-item']}>
            <ActiveLink
              to="/folder"
              onClick={openFiles}
              onActiveChange={this.toggleOpening}
              className={classNames(
                styles['coz-nav-link'],
                styles['fil-cat-files']
              )}
              activeClassName={styles['active']}
              disabled={opening}
            >
              {t('Nav.item_drive')}
            </ActiveLink>
          </li>
          <li className={styles['coz-nav-item']}>
            <ActiveLink
              to="/recent"
              onClick={openRecent}
              onActiveChange={this.toggleOpening}
              className={classNames(
                styles['coz-nav-link'],
                styles['fil-cat-recent']
              )}
              activeClassName={styles['active']}
              disabled={opening}
            >
              {t('Nav.item_recent')}
            </ActiveLink>
          </li>
          <li className={styles['coz-nav-item']}>
            <ActiveLink
              to="/trash"
              onClick={openTrash}
              onActiveChange={this.toggleOpening}
              className={classNames(
                styles['coz-nav-link'],
                styles['fil-cat-trash']
              )}
              activeClassName={styles['active']}
              disabled={opening}
            >
              {t('Nav.item_trash')}
            </ActiveLink>
          </li>
          {__TARGET__ === 'mobile' && (
            <li className={styles['coz-nav-item']}>
              <Link
                to="/settings"
                className={classNames(
                  styles['coz-nav-link'],
                  styles['fil-cat-settings']
                )}
                activeClassName={styles['active']}
                disabled={opening}
              >
                {t('Nav.item_settings')}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  openFiles: () => dispatch(openFiles()),
  openRecent: () => dispatch(openRecent()),
  openTrash: () => dispatch(openTrash())
})

export default connect(null, mapDispatchToProps)(translate()(Nav))
