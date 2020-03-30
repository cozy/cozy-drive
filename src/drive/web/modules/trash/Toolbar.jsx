/* global cozy */
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Button, withBreakpoints } from 'cozy-ui/transpiled/react'
import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'
import { useClient } from 'cozy-client'
import { showModal } from 'react-cozy-helpers'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'
import EmptyTrashConfirm from './components/EmptyTrashConfirm'

import { emptyTrash } from './actions'
import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/toolbar.styl'

import SelectableItem from '../drive/Toolbar/selectable/SelectableItem'

const Toolbar = ({
  t,
  disabled,
  selectionModeActive,
  emptyTrash,
  breakpoints: { isMobile }
}) => {
  const client = useClient()
  const { BarRight } = cozy.bar
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
    <div
      data-test-id="empty-trash"
      className={styles['fil-toolbar-trash']}
      role="toolbar"
    >
      <Button
        theme="danger-outline"
        className="u-hide--mob"
        onClick={() => emptyTrash()}
        disabled={disabled || selectionModeActive}
        icon="trash"
        label={t('toolbar.empty_trash')}
      />

      {isMobile ? (
        <BarRight>
          <BarContextProvider client={client} t={t} store={client.store}>
            {MoreMenu}
          </BarContextProvider>
        </BarRight>
      ) : (
        MoreMenu
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  selectionModeActive: isSelectionBarVisible(state)
})

const mapDispatchToProps = dispatch => ({
  emptyTrash: () =>
    dispatch(
      showModal(<EmptyTrashConfirm onConfirm={() => dispatch(emptyTrash())} />)
    )
})

export default translate()(
  withBreakpoints()(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Toolbar)
  )
)
