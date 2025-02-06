import React from 'react'

import { useQuery } from 'cozy-client'
import Box from 'cozy-ui/transpiled/react/Box'
import Button from 'cozy-ui/transpiled/react/Buttons'

import { ROOT_DIR_ID, TRASH_DIR_ID } from 'constants/config'
import useCurrentFolderId from 'hooks/useCurrentFolderId'
import VirtualizedTable from 'modules/views/Drive/POC_VirtualizedTable'
import { buildDriveQuery, buildMagicFolderQuery } from 'queries'

// #region SAMPLE DATA START
const sample = [
  ['File 01', '01 Janvier 2025', '60 kB', '-'],
  ['File 02', '01 Janvier 2025', '60 kB', '-'],
  ['File 03', '01 Janvier 2025', '60 kB', '-'],
  ['File 04', '01 Janvier 2025', '60 kB', '-'],
  ['File 05', '01 Janvier 2025', '60 kB', '-']
]

function createFakeData(id, name, updatedAt, size, share) {
  return { id, name, updatedAt, size, share }
}
const getRandomSelection = () => {
  return sample[Math.floor(Math.random() * sample.length)]
}

const FAKE_DATA = []

for (let i = 0; i < 200; i += 1) {
  FAKE_DATA.push(createFakeData(i, ...getRandomSelection()))
}
// #endregion SAMPLE DATA END

export const POC_FolderViewBody = () => {
  const [data, setData] = React.useState(FAKE_DATA)
  const currentFolderId = useCurrentFolderId()
  const sortOrder = { attribute: 'name', order: 'asc' }
  const folderQuery = buildDriveQuery({
    currentFolderId,
    type: 'directory',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const fileQuery = buildDriveQuery({
    currentFolderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const trashFolderQuery = buildMagicFolderQuery({
    id: TRASH_DIR_ID,
    enabled: currentFolderId === ROOT_DIR_ID
  })
  const sharedFolderQuery = buildMagicFolderQuery({
    id: 'io.cozy.files.shared-drives-dir',
    enabled: currentFolderId === ROOT_DIR_ID
  })

  const foldersResult = useQuery(folderQuery.definition, folderQuery.options)
  const filesResult = useQuery(fileQuery.definition, fileQuery.options)
  const trashFolderResult = useQuery(
    trashFolderQuery.definition,
    trashFolderQuery.options
  )
  const sharedFolderResult = useQuery(
    sharedFolderQuery.definition,
    sharedFolderQuery.options
  )

  let allResults = [foldersResult, filesResult]
  if (currentFolderId === ROOT_DIR_ID) {
    // The folder may not be found if the user has not configured shared drives
    if (sharedFolderResult.fetchStatus === 'loaded') {
      allResults = [
        sharedFolderResult,
        foldersResult,
        trashFolderResult,
        filesResult
      ]
    } else {
      allResults = [foldersResult, trashFolderResult, filesResult]
    }
  }

  const handleFakeButton = () => {
    const newFakeData = createFakeData(data.length, ...getRandomSelection())
    setData([...data, newFakeData])
  }

  const isInError = allResults.some(result => result.fetchStatus === 'failed')
  const isLoading = allResults.some(
    result => result.fetchStatus === 'loading' && !result.lastUpdate
  )
  const isPending = allResults.some(result => result.fetchStatus === 'pending')

  if (isInError) {
    return <div>Error</div>
  }

  if (isPending || isLoading) {
    return <div>Loading...</div>
  }

  const files = allResults
    ?.flatMap(result => result?.data)
    ?.map(file => ({
      id: file?._id,
      name: file?.name,
      updatedAt: file?.updated_at
        ? new Date(file.updated_at).toLocaleDateString()
        : '-',
      size: '-',
      share: '-'
    }))

  return (
    <Box style={{ height: 400, width: '100%' }}>
      <Button label="Add fake data" onClick={handleFakeButton} />
      <VirtualizedTable
        rowCount={data.length}
        rowGetter={({ index }) => data[index]}
        columns={[
          {
            width: 50, // percentage of total width
            label: 'Nom',
            dataKey: 'name',
            textAlign: 'left'
          },
          {
            width: 20,
            label: 'Mise à jour',
            dataKey: 'updatedAt',
            textAlign: 'center'
          },
          {
            width: 10,
            label: 'Taille',
            dataKey: 'size',
            textAlign: 'center'
          },
          {
            width: 10,
            label: 'Partage',
            dataKey: 'share',
            textAlign: 'center'
          }
        ]}
      />
    </Box>
  )
}
