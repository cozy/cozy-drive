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

  return (
    <RightClickFileMenu doc={item} actions={context.actions} {...props}>
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
  const { toggleSelectedItem } = useSelectionContext()
  const { isNew } = useNewItemHighlightContext()

  return (
    <div className="u-h-100" tabIndex={0} style={{ outline: 'none' }}>
      <VirtuosoTableDnd
        context={{ actions }}
        components={components}
        rows={rows}
        columns={columns}
        dragProps={dragProps}
        endReached={fetchMore}
        defaultOrder={{
          direction: sortOrder?.order || 'asc',
          by: sortOrder?.attribute || columns?.[0]?.id
        }}
        secondarySort={secondarySort}
        onSelectAll={selectAll}
        onSelect={toggleSelectedItem}
        isSelectedItem={isSelectedItem}
        isNewItem={isNew}
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
    </div>
  )
}

Table.displayName = 'Table'

export default React.memo(Table)
