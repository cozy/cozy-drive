/* global cozy */
import React, { useState, useCallback } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Button from 'cozy-ui/transpiled/react/Button'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { showModal } from 'react-cozy-helpers'

import { MoreButton } from 'components/Button'
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
  const { BarRight } = cozy.bar
  const [menuIsVisible, setMenuVisible] = useState(false)
  const anchorRef = React.createRef()
  const openMenu = useCallback(() => setMenuVisible(true))
  const closeMenu = useCallback(() => setMenuVisible(false))

  const MoreMenu = (
    <div>
      <div ref={anchorRef}>
        <MoreButton onClick={openMenu} />
      </div>
      {menuIsVisible && (
        <ActionMenu
          placement="bottom-end"
          anchorElRef={anchorRef}
          onClose={closeMenu}
          autoclose
        >
          <ActionMenuItem
            onClick={() => emptyTrash()}
            left={<Icon icon="trash" color="var(--pomegranate)" />}
          >
            <span className="u-pomegranate">{t('toolbar.empty_trash')}</span>
          </ActionMenuItem>
          <hr />
          <SelectableItem />
        </ActionMenu>
      )}
    </div>
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

      {isMobile ? <BarRight>{MoreMenu}</BarRight> : MoreMenu}
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

export default compose(
  translate(),
  withBreakpoints(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Toolbar)
