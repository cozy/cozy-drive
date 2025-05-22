import React from 'react'

import VirtuosoTable from 'cozy-ui/transpiled/react/Table/Virtualized'

import { secondarySort } from '../helpers'

import Cell from '@/modules/filelist/virtualized/cells/Cell'

const Table = ({
  rows,
  columns,
  dragProps,
  selectAll,
  fetchMore,
  toggleSelectedItem,
  isSelectedItem,
  selectedItems,
  currentFolderId,
  withFilePath,
  actions
}) => {
  return (
    <VirtuosoTable
      rows={rows}
      columns={columns}
      dragProps={dragProps}
      endReached={fetchMore}
      defaultOrder={columns?.[0]?.id}
      secondarySort={secondarySort}
      onSelectAll={selectAll}
      onSelect={toggleSelectedItem}
      isSelectedItem={isSelectedItem}
      selectedItems={selectedItems}
      increaseViewportBy={200}
      componentsProps={{
        rowContent: {
          children: (
            <Cell
              currentFolderId={currentFolderId}
              withFilePath={withFilePath}
              actions={actions}
            />
          )
        }
      }}
    />
  )
}

export default React.memo(Table)
