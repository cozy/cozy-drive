import styles from '../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'
import classNames from 'classnames'

import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'

const Toolbar = ({ t, disabled, onSelectItemsClick }) => (
  <div className={styles['fil-toolbar-trash']} role='toolbar'>
    <MenuButton>
      <button
        role='button'
        className={classNames('coz-btn', styles['fil-toolbar-more-btn'])
        }
        disabled={disabled}
      >
        <span className='coz-hidden'>{ t('toolbar.item_more') }</span>
      </button>
      <Menu className={styles['fil-toolbar-menu']}>
        <Item>
          <a className={styles['fil-action-select']} onClick={onSelectItemsClick}>
            {t('toolbar.menu_select')}
          </a>
        </Item>
      </Menu>
    </MenuButton>
  </div>
)

export default translate()(Toolbar)
