import React, { forwardRef } from 'react'

import VirtuosoTable from 'cozy-ui/transpiled/react/Table/Virtualized'
import TableRowDnD from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/TableRow'
import virtuosoComponents from 'cozy-ui/transpiled/react/Table/Virtualized/virtuosoComponents'

import { secondarySort } from '../helpers'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import Cell from '@/modules/filelist/virtualized/cells/Cell'

const TableRow = forwardRef(({ item, context, children, ...props }, ref) => {
  const isSelected = context?.isSelectedItem(item)
  const isDisabled = context?.itemsInDropProcess.includes(item._id)

  return (
    <RightClickFileMenu doc={item} actions={context.actions} {...props}>
      <TableRowDnD
        ref={ref}
        item={item}
        context={context}
        selected={isSelected}
        disabled={isDisabled}
        hover
      >
        {children}
      </TableRowDnD>
    </RightClickFileMenu>
  )
})

TableRow.displayName = 'TableRow'

const TableRowMemo = React.memo(TableRow)

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
      context={{ actions }}
      components={{ ...virtuosoComponents, TableRow: TableRowMemo }}
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
