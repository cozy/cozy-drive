import React from 'react'
import PropTypes from 'prop-types'

import { ConfirmDialog } from 'cozy-ui/react/CozyDialogs'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react'
import { useQuery } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'

import { buildFolderByPathQuery } from 'drive/web/modules/queries'
import { LoaderModal } from 'drive/web/modules/move/LoaderModal'
import { getEntriesName } from 'drive/web/modules/move/helpers'

/**
 * Alert the user when is trying to move a folder/file outside of a shared folder
 */
const MoveOutsideSharedFolderModal = ({ entries, onCancel, onConfirm }) => {
  const { t } = useI18n()
  const { getSharedParentPath } = useSharingContext()

  const sharedParentPath = getSharedParentPath(entries[0].path)
  const folderByPathQuery = buildFolderByPathQuery(sharedParentPath)
  const { fetchStatus, data } = useQuery(
    folderByPathQuery.definition,
    folderByPathQuery.options
  )

  if (fetchStatus === 'loaded') {
    return (
      <ConfirmDialog
        open
        title={t('Move.outsideSharedFolder.title', {
          sharedFolder: data[0].name
        })}
        content={t('Move.outsideSharedFolder.content', {
          entriesName: getEntriesName(entries, t),
          sharedFolder: data[0].name
        })}
        actions={
          <>
            <Buttons
              variant="secondary"
              label={t('Move.outsideSharedFolder.cancel')}
              onClick={onCancel}
            />
            <Buttons
              label={t('Move.outsideSharedFolder.confirm')}
              onClick={onConfirm}
            />
          </>
        }
      />
    )
  }

  return <LoaderModal />
}

MoveOutsideSharedFolderModal.propTypes = {
  /** List of files or folder to move */
  entries: PropTypes.array.isRequired,
  /** Function called when the user cancels the move action */
  onCancel: PropTypes.func.isRequired,
  /** Function called when the user confirms the move action */
  onConfirm: PropTypes.func.isRequired
}

export { MoveOutsideSharedFolderModal }
