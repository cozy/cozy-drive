export const columns = [
  {
    id: 'name',
    // width: 300,
    maxWidth: 0,
    label: 'Nom'
  },
  {
    id: 'updated_at',
    disablePadding: false,
    width: 115,
    label: 'Mise à jour',
    textAlign: 'right'
  },
  {
    id: 'size',
    disablePadding: false,
    width: 80,
    label: 'Taille',
    textAlign: 'right'
  },
  {
    id: 'share',
    disablePadding: false,
    width: 125,
    label: 'Partage',
    textAlign: 'right',
    sortable: false
  },
  {
    id: 'menu',
    disablePadding: false,
    width: 60,
    label: 'Menu',
    textAlign: 'center',
    sortable: false
  }
]

/**
 * Sort files by type
 * @param {import('cozy-client/types').IOCozyFile[]} file
 * @returns {import('cozy-client/types').IOCozyFile[]}
 */
export const secondarySort = file => {
  const { folders, files, trashFolder } = file.reduce(
    (acc, el) => {
      if (el.type === 'directory') {
        if (el.name === '.cozy_trash') {
          acc.trashFolder.push(el)
        } else {
          acc.folders.push(el)
        }
      } else if (el.type === 'file') {
        acc.files.push(el)
      }
      return acc
    },
    { folders: [], files: [], trashFolder: [] }
  )

  return [...folders, ...trashFolder, ...files]
}
