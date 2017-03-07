import styles from '../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

import { showSelectionBar } from '../actions'
import { mustShowSelectionBar } from '../reducers'

const TrashToolbar = ({ t, error, isSelectionBarVisible, showSelectionBar }) => (
  <div className={styles['fil-toolbar-trash']} role='toolbar'>
    <MenuButton>
      <button
        role='button'
        className={classNames(
          'coz-btn coz-btn--secondary coz-btn--more',
          styles['fil-toolbar-more-btn'])
        }
        disabled={!!error || isSelectionBarVisible}
      >
        <span className='coz-hidden'>{ t('toolbar.item_more') }</span>
      </button>
      <Menu className={styles['fil-toolbar-menu']}>
        <Item>
          <a className={styles['fil-action-select']} onClick={showSelectionBar}>
            {t('toolbar.menu_select')}
          </a>
        </Item>
      </Menu>
    </MenuButton>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  error: state.ui.error,
  isSelectionBarVisible: mustShowSelectionBar(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  showSelectionBar: () => {
    dispatch(showSelectionBar())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(TrashToolbar))
