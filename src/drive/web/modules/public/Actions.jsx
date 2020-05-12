import React from 'react'
import { showModal } from 'react-cozy-helpers'
import { downloadFiles, trashFiles } from 'drive/web/modules/navigation/duck'
import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import {
  isRenaming,
  getRenamingFile,
  startRenamingAsync
} from 'drive/web/modules/drive/rename'
import { isFile, isReferencedByAlbum } from 'drive/web/modules/drive/files'

const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

export const mapStateToProps = state => ({
  isRenaming: isRenaming(state),
  renamingFile: getRenamingFile(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => {
  const { onFileDelete, hasWriteAccess } = ownProps
  return {
    actions: Object.assign({}, ownProps.actions, {
      download: {
        action: files => dispatch(downloadFiles(files))
      },
      trash: {
        action: files =>
          dispatch(
            showModal(
              <DeleteConfirm
                files={files}
                referenced={isAnyFileReferencedByAlbum(files)}
                onConfirm={async () => {
                  await dispatch(trashFiles(files))
                  onFileDelete()
                }}
              />
            )
          ),
        displayCondition: () => hasWriteAccess
      },
      rename: {
        action: selected => dispatch(startRenamingAsync(selected[0])),
        displayCondition: selections =>
          selections.length === 1 && hasWriteAccess
      },
      history: {
        action: selected => {
          return ownProps.router.push(
            `${ownProps.location.pathname}/file/${selected[0].id}/revision`
          )
        },
        displayCondition: selections =>
          selections.length === 1 && isFile(selections[0]) && hasWriteAccess
      }
    })
  }
}
