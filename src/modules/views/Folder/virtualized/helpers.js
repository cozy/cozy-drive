import { move } from 'cozy-client/dist/models/file'

import logger from '@/lib/logger'

export const makeRows = ({ queryResults, IsAddingFolder, syncingFakeFile }) => {
  const rows = queryResults.flatMap(el => el.data)
  if (IsAddingFolder) {
    rows.push({
      type: 'tempDirectory'
    })
  }
  if (syncingFakeFile) {
    rows.push(syncingFakeFile)
  }

  return rows
}

export const onDrop =
  ({ client, showAlert, selectAll, registerCancelable, sharedPaths, t }) =>
  async (draggedItems, itemHovered, selectedItems) => {
    if (
      itemHovered.type !== 'directory' ||
      draggedItems.some(({ _id }) => _id === itemHovered._id)
    ) {
      return null
    }

    if (selectedItems.length > 0) {
      selectAll([])
    }

    try {
      await Promise.all(
        draggedItems.map(async draggedItem => {
          const force = !sharedPaths.includes(itemHovered.path)
          await registerCancelable(
            move(client, draggedItem, itemHovered, {
              force
            })
          )
        })
      )
      showAlert({
        severity: 'success',
        message: t('Move.success', {
          subject: draggedItems[0].name,
          target: itemHovered.name,
          smart_count: draggedItems.length
        })
      })
    } catch (error) {
      logger.warn(`Error while dragging files:`, error)
      showAlert({
        severity: 'error',
        message: t('Move.error', {
          smart_count: draggedItems.length
        })
      })
    }
  }
