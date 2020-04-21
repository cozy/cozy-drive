import React from 'react'

import { MoreButton } from 'components/Button'
import Menu, { Item } from 'components/Menu'
import { isMobileApp } from 'cozy-device-helper'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import styles from 'drive/styles/toolbar.styl'

import NotRootFolder from 'drive/web/modules/drive/Toolbar/components/NotRootFolder'

import UploadItem from './UploadItem'
import DeleteItem from '../delete/DeleteItem'
import SelectableItem from '../selectable/SelectableItem'
import AddFolderItem from './AddFolderItem'
import CreateNoteItem from './CreateNoteItem'
import CreateShortcut from './CreateShortcut'
import DownloadButtonItem from './DownloadButtonItem'
import ShareItem from '../share/ShareItem'
import ScanWrapper from './ScanWrapper'

const MoreMenu = ({
  t,
  isDisabled,
  canCreateFolder,
  canUpload,
  hasWriteAccess
}) => (
  <Menu
    title={t('toolbar.item_more')}
    disabled={isDisabled}
    className={styles['fil-toolbar-menu']}
    innerClassName={styles['fil-toolbar-inner-menu']}
    button={<MoreButton />}
  >
    {canCreateFolder &&
      hasWriteAccess && (
        <Item>
          <AddFolderItem />
        </Item>
      )}
    {hasWriteAccess && (
      <Item>
        <CreateNoteItem />
      </Item>
    )}
    {hasWriteAccess && (
      <Item>
        <CreateShortcut />
      </Item>
    )}
    {canUpload &&
      hasWriteAccess && (
        <Item>
          <UploadItem insideMoreMenu disabled={isDisabled} />
        </Item>
      )}
    {isMobileApp() &&
      canUpload &&
      hasWriteAccess && (
        <Item>
          <ScanWrapper insideMoreMenu disabled={isDisabled} />
        </Item>
      )}
    <hr />
    <NotRootFolder>
      <Item>
        <ShareItem />
      </Item>
    </NotRootFolder>
    <NotRootFolder>
      <Item>
        <DownloadButtonItem />
      </Item>
    </NotRootFolder>
    <Item>
      <SelectableItem>
        <a className={styles['fil-action-select']}>
          {t('toolbar.menu_select')}
        </a>
      </SelectableItem>
    </Item>
    <NotRootFolder>
      <hr />
      <Item>
        <DeleteItem />
      </Item>
    </NotRootFolder>
  </Menu>
)

export default translate()(MoreMenu)
