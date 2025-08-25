import React, { useEffect, forwardRef } from 'react'

import VirtuosoTableDnd from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd'
import TableRowDnD from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/TableRow'
import virtuosoComponentsDnd from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/virtuosoComponents'

import { secondarySort } from '../helpers'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import Cell from '@/modules/filelist/virtualized/cells/Cell'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

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

const components = {
  ...virtuosoComponentsDnd,
  TableRow: TableRowMemo
}

const Table = ({
  rows,
  columns,
  dragProps,
  selectAll,
  fetchMore,
  isSelectedItem,
  selectedItems,
  currentFolderId,
  withFilePath,
  actions
}) => {
  const {
    handleShiftClick,
    handleShiftArrow,
    setItemsList,
    focusedIndex,
    toggleSelectedItem,
    isKeyboardNavigating
  } = useSelectionContext()

  useEffect(() => {
    setItemsList(rows)
  }, [rows, setItemsList])

  const handleRowSelect = (event, row, visualIndex) => {
    event.stopPropagation()
    if (event.shiftKey && visualIndex !== undefined) {
      handleShiftClick(row, visualIndex)
    } else {
      toggleSelectedItem(row, visualIndex)
    }
  }

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
      onSelect={handleRowSelect}
      isSelectedItem={isSelectedItem}
      selectedItems={selectedItems}
      handleShiftArrow={handleShiftArrow}
      increaseViewportBy={200}
      componentsProps={{
        rowContent: {
          children: (
            <Cell
              currentFolderId={currentFolderId}
              withFilePath={withFilePath}
              actions={actions}
              focusedIndex={focusedIndex}
              isKeyboardNavigating={isKeyboardNavigating}
            />
          )
        }
      }}
    />
  )
}

export default React.memo(Table)
