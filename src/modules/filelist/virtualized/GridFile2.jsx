import cx from 'classnames'
import { filesize } from 'filesize'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'

import { isDirectory } from 'cozy-client/dist/models/file'
import Card from 'cozy-ui/transpiled/react/Card'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Filename from 'cozy-ui/transpiled/react/Filename'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

// import {
//   SelectBox,
//   FileName,
//   Status,
//   FileAction,
//   SharingShortcutBadge
// } from '../cells'

import FileName from './cells/FileName'
import SharingShortcutBadge from './cells/SharingShortcutBadge'

import styles from '@/styles/filelist.styl'

import { useClipboardContext } from '@/contexts/ClipboardProvider'
import { ActionMenuWithHeader } from '@/modules/actionmenu/ActionMenuWithHeader'
import { extraColumnsPropTypes } from '@/modules/certifications'
import {
  isRenaming as isRenamingSelector,
  getRenamingFile
} from '@/modules/drive/rename'
import FileOpener from '@/modules/filelist/FileOpener'
import {
  getFileNameAndExtension,
  makeParentFolderPath
} from '@/modules/filelist/helpers'
import FileThumbnail from '@/modules/filelist/icons/FileThumbnail'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

const GridFile = ({
  attributes,
  withFilePath,
  refreshFolderContent,
  isInSyncFromSharing,
  onContextMenu
}) => {
  const { t, f } = useI18n()
  const { isMobile, isExtraLarge } = useBreakpoints()
  const fileIndex = null

  const {
    toggleSelectedItem,
    isItemSelected,
    isSelectionBarVisible,
    handleShiftClick
  } = useSelectionContext()

  const toggle = e => {
    e.stopPropagation()
    if (e.shiftKey && fileIndex !== null) {
      handleShiftClick(attributes, fileIndex)
    } else {
      toggleSelectedItem(attributes, fileIndex)
    }
  }

  const selected = isItemSelected(attributes._id)

  const isRenaming = useSelector(
    state =>
      isRenamingSelector(state) &&
      get(getRenamingFile(state), 'id') === attributes.id
  )

  const formattedSize =
    !isDirectory(attributes) && attributes.size
      ? filesize(attributes.size, { base: 10 })
      : undefined
  const updatedAt = attributes.updated_at || attributes.created_at
  const formattedUpdatedAt = f(
    updatedAt,
    isExtraLarge
      ? t('table.row_update_format_full')
      : t('table.row_update_format')
  )

  const { title } = getFileNameAndExtension(attributes, t)

  return (
    <>
      <Checkbox
        checked={selected}
        onClick={e => toggle(e)}
        // disabled={
        //   !canInteractWithFile ||
        //   isRowDisabledOrInSyncFromSharing ||
        //   disableSelection
        // }
      />
      <FileOpener
        file={attributes}
        // disabled={
        //   isRowDisabledOrInSyncFromSharing || isCut || actionMenuVisible
        // }
        toggle={toggle}
        isRenaming={isRenaming}
      >
        <div className="u-flex u-flex-justify-center">
          <FileThumbnail
            file={attributes}
            size={96}
            isInSyncFromSharing={isInSyncFromSharing}
            showSharedBadge={isMobile}
            componentsProps={{
              sharedBadge: {
                className: styles['fil-content-shared']
              }
            }}
          />
        </div>
        <div title={title} className="u-ellipsis">
          {title}
        </div>
        <SharingShortcutBadge file={attributes} />
      </FileOpener>
    </>
  )
}

export default GridFile
