import clsx from 'clsx'
import PropTypes from 'prop-types'
import React from 'react'
import { AutoSizer, Column, Table } from 'react-virtualized'

import TableCell from 'cozy-ui/transpiled/react/TableCell'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined
    }
  },
  tableRow: {
    cursor: 'pointer'
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: 'initial'
  }
}))

const MuiVirtualizedTable = ({
  headerHeight = 48,
  rowHeight = 48,
  columns,
  onRowClick,
  ...tableProps
}) => {
  const classes = useStyles()
  const getRowClassName = ({ index }) => {
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    })
  }

  const cellRenderer = ({ cellData, columnIndex }) => {
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={columns?.[columnIndex]?.textAlign ?? 'left'}
      >
        {cellData}
      </TableCell>
    )
  }

  const headerRenderer = ({ label, columnIndex }) => {
    console.log('headerRenderer', label, columnIndex)
    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns?.[columnIndex]?.textAlign ?? 'left'}
      >
        <span>{label}</span>
      </TableCell>
    )
  }

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit'
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={getRowClassName}
          >
            {columns.map(({ dataKey, width: columnWidth, ...other }, index) => {
              const w = width * (columnWidth / 100)
              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    headerRenderer({
                      ...headerProps,
                      columnIndex: index
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={cellRenderer}
                  dataKey={dataKey}
                  width={w}
                  {...other}
                />
              )
            })}
          </Table>
        )
      }}
    </AutoSizer>
  )
}

MuiVirtualizedTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      textAlign: PropTypes.string,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number
}

const VirtualizedTable = React.memo(MuiVirtualizedTable)

export default VirtualizedTable
