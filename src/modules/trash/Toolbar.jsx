import React, { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import EmptyTrashConfirm from './components/EmptyTrashConfirm'
import SelectableItem from '../drive/Toolbar/selectable/SelectableItem'
import { BarRightWithProvider } from 'components/Bar'
import { MoreButton } from 'components/Button'
import { useModalContext } from 'lib/ModalContext'
import { emptyTrash } from 'modules/actions/utils'
import SearchButton from 'modules/drive/Toolbar/components/SearchButton'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

import styles from 'styles/toolbar.styl'

export const Toolbar = ({ disabled }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuIsVisible, setMenuVisible] = useState(false)
  const anchorRef = React.createRef()
  const openMenu = useCallback(() => setMenuVisible(true), [setMenuVisible])
  const closeMenu = useCallback(() => setMenuVisible(false), [setMenuVisible])

  const { pushModal, popModal } = useModalContext()
  const { showSelectionBar, isSelectionBarVisible } = useSelectionContext()

  const onEmptyTrash = useCallback(() => {
    pushModal(
      <EmptyTrashConfirm
        onClose={popModal}
        onConfirm={() => {
          emptyTrash(client)
        }}
      />
    )
  }, [pushModal, popModal, client])

  const MoreMenu = (
    <div>
      <div ref={anchorRef}>
        <MoreButton
          onClick={openMenu}
          disabled={disabled || isSelectionBarVisible}
        />
      </div>
      {menuIsVisible && (
        <ActionMenu
          popperOptions={{
            placement: 'bottom-end'
          }}
          anchorElRef={anchorRef}
          onClose={closeMenu}
          autoclose
        >
          {isMobile && (
            <>
              <ActionMenuItem
                onClick={onEmptyTrash}
                left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
              >
                <span className="u-error">{t('toolbar.empty_trash')}</span>
              </ActionMenuItem>
              <hr />
            </>
          )}
          <SelectableItem showSelectionBar={showSelectionBar} />
        </ActionMenu>
      )}
    </div>
  )

  return (
    <div
      data-testid="empty-trash"
      className={styles['fil-toolbar-trash']}
      role="toolbar"
    >
      {!isMobile && (
        <Button
          theme="danger-outline"
          onClick={onEmptyTrash}
          disabled={disabled || isSelectionBarVisible}
          icon={TrashIcon}
          label={t('toolbar.empty_trash')}
        />
      )}
      <BarRightWithProvider>
        {isMobile && <SearchButton navigate={navigate} pathname={pathname} />}
        {MoreMenu}
      </BarRightWithProvider>
    </div>
  )
}

export default Toolbar
