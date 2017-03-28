/* global __TARGET__ */

import styles from '../styles/nav'

import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Spinner from '../components/Spinner'
import { openFiles, openTrash } from '../actions'

class Link extends Component {
  constructor (props) {
    super(props)
    this.state = {
      opening: false
    }
  }

  open (e) {
    e.preventDefault()
    this.setState({ opening: true })
    this.props.onClick()
      .then(() => {
        this.setState({ opening: false })
        this.props.router.push(this.props.to)
      })
  }

  render () {
    const { router, location, to, activeClassName, children, ...props } = this.props
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
        {opening && <Spinner />}
      </a>
    )
  }
}

const ActiveLink = withRouter(Link)

const Nav = ({ t, location, openFiles, openTrash }) => {
  return (
    <nav>
      <ul class={styles['coz-nav']}>
        <li class={styles['coz-nav-item']}>
          <ActiveLink
            to='/files'
            onClick={openFiles}
            className={classNames(
              styles['coz-nav-link'],
              styles['fil-cat-files']
            )}
            activeClassName={styles['active']}
          >
            { t('nav.item_files') }
          </ActiveLink>
        </li>
        <li class={styles['coz-nav-item']}>
          <ActiveLink
            to='/trash'
            onClick={openTrash}
            className={classNames(
              styles['coz-nav-link'],
              styles['fil-cat-trash']
            )}
            activeClassName={styles['active']}
          >
            { t('nav.item_trash') }
          </ActiveLink>
        </li>
        {__TARGET__ === 'mobile' &&
        <li class={styles['coz-nav-item']}>
          <Link
            to='/settings'
            className={classNames(styles['coz-nav-link'], styles['fil-cat-settings'])}
            activeClassName={styles['active']}
          >
            { t('nav.item_settings') }
          </Link>
        </li>
        }
      </ul>
    </nav>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  openFiles: () => dispatch(openFiles()),
  openTrash: () => dispatch(openTrash())
})

export default connect(null, mapDispatchToProps)(
  translate()(Nav)
)
