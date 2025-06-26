import React, { forwardRef } from 'react'

import VirtuosoTableDnd from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd'
import TableRowDnD from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/TableRow'
import virtuosoComponentsDnd from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/virtuosoComponents'

import { secondarySort } from '../helpers'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import Cell from '@/modules/filelist/virtualized/cells/Cell'

const TableRow = forwardRef(({ item, context, children, ...props }, ref) => {
  return (
    <RightClickFileMenu doc={item} actions={context.actions} {...props}>
      <TableRowDnD ref={ref} item={item} context={context}>
        {children}
      </TableRowDnD>
    </RightClickFileMenu>
  )
})

TableRow.displayName = 'TableRow'

const TableRowMemo = React.memo(TableRow)

const components = { ...virtuosoComponentsDnd, TableRow: TableRowMemo }

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
    <VirtuosoTableDnd
      context={{ actions }}
      components={components}
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
