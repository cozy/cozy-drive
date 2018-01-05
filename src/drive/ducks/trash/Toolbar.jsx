/* global cozy */
import styles from '../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { Button, Icon, withBreakpoints } from 'cozy-ui/react'
import confirm from '../../lib/confirm'
import classNames from 'classnames'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'
import EmptyTrashConfirm from './components/EmptyTrashConfirm'

import { emptyTrash } from './actions'

const { BarRight } = cozy.bar

const Toolbar = ({
  t,
  disabled,
  emptyTrash,
  onSelectItemsClick,
  breakpoints: { isMobile }
}) => {
  const MoreMenu = (
    <Menu
      title={t('toolbar.item_more')}
      disabled={disabled}
      className={styles['fil-toolbar-menu']}
      button={<MoreButton>{t('Toolbar.more')}</MoreButton>}
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
  )

  return (
    <div className={styles['fil-toolbar-trash']} role="toolbar">
      <Button
        theme={'danger-outline'}
        className={classNames(styles['u-hide--mob'])}
        onClick={() => emptyTrash()}
        disabled={disabled}
      >
        <Icon icon="delete" />
        {t('toolbar.empty_trash')}
      </Button>

      {isMobile ? <BarRight>{MoreMenu}</BarRight> : MoreMenu}
    </div>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  emptyTrash: () =>
    confirm(<EmptyTrashConfirm t={ownProps.t} />)
      .then(() => dispatch(emptyTrash()))
      .catch(() => {})
})

export default translate()(
  withBreakpoints()(connect(null, mapDispatchToProps)(Toolbar))
)
