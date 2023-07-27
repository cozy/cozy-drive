import React from 'react'
import PropTypes from 'prop-types'

import { useQuery } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/react/CozyDialogs'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react'

import { buildOnlyFolderQuery } from 'drive/web/modules/queries'
import { getEntriesName } from 'drive/web/modules/move/helpers'
import { LoaderModal } from 'drive/web/modules/move/LoaderModal'

/**
 * Alert the user when is trying to move a shared folder/file inside another shared folder
 */
const MoveSharedFolderInsideAnotherModal = ({
  entries,
  folderId,
  onCancel,
  onConfirm
}) => {
  const { t } = useI18n()

  const folderQuery = buildOnlyFolderQuery(folderId)
  const { fetchStatus, data } = useQuery(
    folderQuery.definition,
    folderQuery.options
  )

  if (fetchStatus === 'loaded') {
    return (
      <ConfirmDialog
        open
        title={t('Move.sharedFolderInsideAnother.title')}
        content={t('Move.sharedFolderInsideAnother.content', {
          source: getEntriesName(entries, t),
          destination: data.name
        })}
        actions={
          <>
            <Buttons
              variant="secondary"
              label={t('Move.sharedFolderInsideAnother.cancel')}
              onClick={onCancel}
            />
            <Buttons
              label={t('Move.sharedFolderInsideAnother.confirm')}
              onClick={onConfirm}
            />
          </>
        }
      />
    )
  }

  return <LoaderModal />
}

MoveSharedFolderInsideAnotherModal.propTypes = {
  /** List of files or folder to move */
  entries: PropTypes.array.isRequired,
  /** Id of the destination folder */
  folderId: PropTypes.string.isRequired,
  /** Function called when the user cancels the move action */
  onCancel: PropTypes.func.isRequired,
  /** Function called when the user confirms the move action */
  onConfirm: PropTypes.func.isRequired
}

export { MoveSharedFolderInsideAnotherModal }
