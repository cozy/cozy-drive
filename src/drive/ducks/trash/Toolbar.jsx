import styles from '../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import confirm from '../../lib/confirm'
import classNames from 'classnames'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'
import EmptyTrashConfirm from './components/EmptyTrashConfirm'

import { emptyTrash } from './actions'

const Toolbar = ({ t, disabled, emptyTrash, onSelectItemsClick }) => (
  <div className={styles['fil-toolbar-trash']} role="toolbar">
    <button
      className={classNames(
        styles['c-btn'],
        styles['c-btn--danger-outline'],
        styles['u-hide--mob'],
        styles['fil-btn--delete']
      )}
      onClick={() => emptyTrash()}
      disabled={disabled}
    >
      {t('toolbar.empty_trash')}
    </button>
    <Menu
      title={t('toolbar.item_more')}
      disabled={disabled}
      className={styles['fil-toolbar-menu']}
      button={<MoreButton />}
    >
      <Item>
        <a className={styles['fil-action-delete']} onClick={() => emptyTrash()}>
          {t('toolbar.empty_trash')}
        </a>
      </Item>
      <hr />
      <Item>
        <a className={styles['fil-action-select']} onClick={onSelectItemsClick}>
          {t('toolbar.menu_select')}
        </a>
      </Item>
    </Menu>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  emptyTrash: () =>
    confirm(<EmptyTrashConfirm t={ownProps.t} />)
      .then(() => dispatch(emptyTrash()))
      .catch(() => {})
})

export default translate()(connect(null, mapDispatchToProps)(Toolbar))
