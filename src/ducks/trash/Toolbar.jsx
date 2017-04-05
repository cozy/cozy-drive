import styles from '../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'
import confirm from '../../lib/confirm'
import classNames from 'classnames'

import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'
import EmptyTrashConfirm from './components/EmptyTrashConfirm'

import { emptyTrash } from './actions'

const Toolbar = ({ t, disabled, emptyTrash, onSelectItemsClick }) => (
  <div className={styles['fil-toolbar-trash']} role='toolbar'>
    <button
      className={classNames(
        'coz-btn', 'coz-btn--danger-outline', styles['fil-btn--delete']
      )}
      onClick={() => emptyTrash()}
    >
      {t('toolbar.delete_all')}
    </button>
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
          <a
            className={styles['fil-action-delete']}
            onClick={() => emptyTrash()}
          >
            {t('toolbar.delete_all')}
          </a>
        </Item>
        <hr />
        <Item>
          <a className={styles['fil-action-select']} onClick={onSelectItemsClick}>
            {t('toolbar.menu_select')}
          </a>
        </Item>
      </Menu>
    </MenuButton>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  emptyTrash: () =>
    confirm(<EmptyTrashConfirm t={ownProps.t} />)
      .then(() => dispatch(emptyTrash()))
      .catch(() => {})
})

export default translate()(connect(null, mapDispatchToProps)(Toolbar))
