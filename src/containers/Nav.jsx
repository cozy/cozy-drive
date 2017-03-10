/* global __TARGET__ */

import styles from '../styles/nav'

import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'

import Spinner from '../components/Spinner'
import { FILES_CONTEXT, TRASH_CONTEXT } from '../constants/config'
import { openFolder } from '../actions'

class ActiveLink extends Component {
  constructor (props) {
    super(props)
    this.state = {
      opening: false
    }
  }

  open (e) {
    this.setState({ opening: true })
    this.props.onClick()
      .then(() => this.setState({ opening: false }))
  }

  render ({ to, className, activeClassName, children }, { opening }) {
    return (
      <Link to={to} className={className} activeClassName={activeClassName} onClick={e => this.open(e)}>
        {children}
        {opening && <Spinner />}
      </Link>
    )
  }
}

const Nav = ({ t, location, openFiles, openTrash }) => {
  const isBrowsingFiles = location.pathname.match(/^\/files/) !== null
  const isBrowsingTrash = location.pathname.match(/^\/trash/) !== null
  return (
    <nav>
      <ul class={styles['coz-nav']}>
        <li class={styles['coz-nav-item']}>
          <ActiveLink
            to='/files'
            onClick={openFiles}
            className={classNames(
              styles['coz-nav-link'],
              styles['fil-cat-files'],
              { [styles['active']]: isBrowsingFiles }
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
              styles['fil-cat-trash'],
              { [styles['active']]: isBrowsingTrash }
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
  openFiles: () => dispatch(openFolder(null, FILES_CONTEXT)),
  openTrash: () => dispatch(openFolder(null, TRASH_CONTEXT))
})

export default connect(null, mapDispatchToProps)(
  withRouter(translate()(Nav))
)
