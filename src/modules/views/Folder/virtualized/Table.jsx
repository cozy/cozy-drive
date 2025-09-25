import React, { useRef, forwardRef, useState, useMemo } from 'react'

import VirtuosoTableDnd from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd'
import TableRowDnD from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/TableRow'
import virtuosoComponentsDnd from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/virtuosoComponents'
import {
  stableSort,
  getComparator
} from 'cozy-ui/transpiled/react/Table/Virtualized/helpers'

import { secondarySort } from '../helpers'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import { useShiftArrowsSelection } from '@/hooks/useShiftArrowsSelection'
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
  actions,
  sortOrder
}) => {
  const {
    handleShiftClick,
    focusedIndex,
    toggleSelectedItem,
    isKeyboardNavigating
  } = useSelectionContext()

  const tableRef = useRef()
  const [order, setOrder] = useState(sortOrder?.order || 'asc')
  const [orderBy, setOrderBy] = useState(
    sortOrder?.attribute || columns?.[0]?.id
  )
  const sortedRow = useMemo(() => {
    const sortedData = stableSort(rows, getComparator(order, orderBy))
    return secondarySort(sortedData)
  }, [rows, order, orderBy])

  useShiftArrowsSelection({ items: sortedRow, viewType: 'list' }, tableRef)

  const handleRowSelect = (row, event, visualIndex) => {
    event.stopPropagation()
    if (event.shiftKey && visualIndex !== undefined) {
      handleShiftClick(row, visualIndex)
    } else {
      toggleSelectedItem(row, visualIndex)
    }
  }

  const handleSort = ({ order, orderBy }) => {
    setOrder(order)
    setOrderBy(orderBy)
  }

  return (
    <div
      className="u-h-100"
      ref={tableRef}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <VirtuosoTableDnd
        context={{ actions }}
        components={components}
        rows={sortedRow}
        columns={columns}
        dragProps={dragProps}
        endReached={fetchMore}
        defaultOrder={{ direction: order, by: orderBy }}
        secondarySort={secondarySort}
        onSelectAll={selectAll}
        onSelect={handleRowSelect}
        isSelectedItem={isSelectedItem}
        selectedItems={selectedItems}
        increaseViewportBy={200}
        onSortChange={handleSort}
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
    </div>
  )
}

export default React.memo(Table)
