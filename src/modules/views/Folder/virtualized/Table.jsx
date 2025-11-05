import React, { forwardRef } from 'react'

import VirtuosoTableDnd from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd'
import TableRowDnD from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/TableRow'
import virtuosoComponentsDnd from 'cozy-ui/transpiled/react/Table/Virtualized/Dnd/virtuosoComponents'

import { secondarySort } from '../helpers'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import { useClipboardContext } from '@/contexts/ClipboardProvider'
import Cell from '@/modules/filelist/virtualized/cells/Cell'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import { useNewItemHighlightContext } from '@/modules/upload/NewItemHighlightProvider'

const TableRow = forwardRef(({ item, context, children, ...props }, ref) => {
  const { isItemCut } = useClipboardContext()
  const isCut = isItemCut(item._id)
  const { actions } = context

  return (
    <RightClickFileMenu doc={item} actions={actions} {...props}>
      <TableRowDnD
        ref={ref}
        item={item}
        context={context}
        componentsProps={{ tableRow: { disabled: isCut } }}
      >
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

const Table = forwardRef(
  (
    {
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
      orderProps = {
        sortOrder: {},
        setOrder: () => {}
      },
      onInteractWithFile
    },
    ref
  ) => {
    const { toggleSelectedItem } = useSelectionContext()
    const { isNew } = useNewItemHighlightContext()

    const { sortOrder, setOrder } = orderProps

    const handleRowSelect = (row, event) => {
      toggleSelectedItem(row)
      onInteractWithFile?.(row?._id, event)
    }

    const handleSort = ({ order, orderBy }) => {
      setOrder({
        order,
        attribute: orderBy
      })
    }

    return (
      <div
        className="u-h-100"
        ref={ref}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        <VirtuosoTableDnd
          context={{ actions, selectedItems, isSelectedItem }}
          components={components}
          rows={rows}
          columns={columns}
          dragProps={dragProps}
          endReached={fetchMore}
          defaultOrder={{
            direction: sortOrder.order,
            by: sortOrder.attribute
          }}
          secondarySort={secondarySort}
          onSelectAll={selectAll}
          onSelect={handleRowSelect}
          isSelectedItem={isSelectedItem}
          isNewItem={isNew}
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
                  onInteractWithFile={onInteractWithFile}
                />
              )
            }
          }}
        />
      </div>
    )
  }
)

Table.displayName = 'Table'

export default React.memo(Table)
