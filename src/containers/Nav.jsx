/* global __TARGET__ */

import styles from '../styles/nav'

import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import Spinner from '../components/Spinner'
import { FILES_CONTEXT, TRASH_CONTEXT, NO_CONTEXT } from '../constants/config'
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

  render ({ to, className, children }, { opening }) {
    return (
      <Link to={to} className={className} onClick={e => this.open(e)}>
        {children}
        {opening && <Spinner />}
      </Link>
    )
  }
}

const Nav = ({ t, context, open }) => {
  return (
    <nav>
      <ul class={styles['coz-nav']}>
        <li class={styles['coz-nav-item']}>
          <ActiveLink
            to='/files'
            onClick={open(FILES_CONTEXT)}
            className={classNames(
              styles['coz-nav-link'],
              styles['fil-cat-files'],
              { [styles['active']]: context === FILES_CONTEXT }
            )}
          >
            { t('nav.item_files') }
          </ActiveLink>
        </li>
        <li class={styles['coz-nav-item']}>
          <ActiveLink
            to='/trash'
            onClick={open(TRASH_CONTEXT)}
            className={classNames(
              styles['coz-nav-link'],
              styles['fil-cat-trash'],
              { [styles['active']]: context === TRASH_CONTEXT }
            )}
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
            onClick={open(NO_CONTEXT)}
          >
            { t('nav.item_settings') }
          </Link>
        </li>
        }
      </ul>
    </nav>
  )
}

const mapStateToProps = (state, ownProps) => ({
  context: state.context
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  open: (context) => () => dispatch(openFolder(null, context))
})

export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(Nav)
)
