import { SHARED_DRIVES_DIR_ID } from '@/constants/config'
import { getDriveI18n } from '@/locales'

export const makeColumns = isBigThumbnail => {
  const { t } = getDriveI18n()

  return [
    {
      id: 'name',
      maxWidth: 0,
      disablePadding: !isBigThumbnail,
      label: t('table.head_name')
    },
    {
      id: 'updated_at',
      disablePadding: false,
      width: 135,
      label: t('table.head_update'),
      textAlign: 'right'
    },
    {
      id: 'size',
      disablePadding: false,
      width: 80,
      label: t('table.head_size'),
      textAlign: 'right'
    },
    {
      id: 'share',
      disablePadding: false,
      width: 125,
      label: t('table.head_status'),
      textAlign: 'right',
      sortable: false
    },
    {
      id: 'menu',
      disablePadding: false,
      width: 60,
      label: '',
      textAlign: 'center',
      sortable: false
    }
  ]
}

/**
 * Sort files by type to put directory and trash before files
 * @param {import('cozy-client/types').IOCozyFile[]} file
 * @returns {import('cozy-client/types').IOCozyFile[]}
 */
export const secondarySort = file => {
  const { tempFolder, folders, files, trashFolder } = file.reduce(
    (acc, el) => {
      if (el.type === 'tempDirectory') {
        acc.tempFolder.push(el)
      } else if (el.type === 'directory') {
        if (el.name === '.cozy_trash') {
          acc.trashFolder.push(el)
        } else if (el._id === SHARED_DRIVES_DIR_ID) {
          acc.folders.unshift(el)
        } else {
          acc.folders.push(el)
        }
      } else if (el.type === 'file') {
        acc.files.push(el)
      }
      return acc
    },
    { tempFolder: [], folders: [], files: [], trashFolder: [] }
  )

  return [...tempFolder, ...folders, ...trashFolder, ...files]
}
