/* global cozy */
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { Button, withBreakpoints } from 'cozy-ui/react'
import { showModal } from 'lib/react-cozy-helpers'
import classNames from 'classnames'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'
import EmptyTrashConfirm from './components/EmptyTrashConfirm'

import { emptyTrash } from './actions'
import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/toolbar'

import SelectableItem from '../drive/Toolbar/selectable/SelectableItem'

const { BarRight } = cozy.bar

const Toolbar = ({
  t,
  disabled,
  selectionModeActive,
  emptyTrash,
  breakpoints: { isMobile }
}) => {
  const MoreMenu = (
    <Menu
      title={t('toolbar.item_more')}
      disabled={disabled || selectionModeActive}
      className={styles['fil-toolbar-menu']}
      button={<MoreButton />}
    >
      <Item>
        <a className={styles['fil-action-delete']} onClick={() => emptyTrash()}>
          {t('toolbar.empty_trash')}
        </a>
      </Item>
      <hr />
      <SelectableItem>
        <a className={styles['fil-action-select']}>
          {t('toolbar.menu_select')}
        </a>
      </SelectableItem>
    </Menu>
  )

  return (
    <div className={styles['fil-toolbar-trash']} role="toolbar">
      <Button
        theme={'danger-outline'}
        className={classNames(styles['u-hide--mob'])}
        onClick={() => emptyTrash()}
        disabled={disabled || selectionModeActive}
        icon="delete"
        label={t('toolbar.empty_trash')}
      />

      {isMobile ? <BarRight>{MoreMenu}</BarRight> : MoreMenu}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  selectionModeActive: isSelectionBarVisible(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  emptyTrash: () =>
    dispatch(
      showModal(<EmptyTrashConfirm onConfirm={() => dispatch(emptyTrash())} />)
    )
})

export default translate()(
  withBreakpoints()(connect(mapStateToProps, mapDispatchToProps)(Toolbar))
)
