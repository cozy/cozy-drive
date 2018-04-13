import styles from '../styles/table'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import { sortFolder, getOpenedFolderId } from '../actions'
import { getSort } from '../reducers'

const SORTABLE_ATTRIBUTES = [
  { label: 'name', attr: 'name', css: 'file', defaultOrder: 'asc' },
  { label: 'update', attr: 'updated_at', css: 'date', defaultOrder: 'desc' }
  // TODO: activate sorting by size when it's ready on the back side
  // { label: 'size', attr: 'size', css: 'size', defaultOrder: 'desc' }
]
const DEFAULT_SORT = { attribute: 'name', order: 'asc' }

const HeaderCell = ({ t, label, css }) => (
  <div
    className={classNames(
      styles['fil-content-header'],
      styles[`fil-content-${css}`]
    )}
  >
    {t(`table.head_${label}`)}
  </div>
)

const SortableHeaderCell = ({
  t,
  label,
  attr,
  css,
  order = null,
  defaultOrder,
  onSort
}) => (
  <div
    onClick={() =>
      onSort(attr, order ? (order === 'asc' ? 'desc' : 'asc') : defaultOrder)
    }
    className={classNames(
      styles['fil-content-header'],
      styles[`fil-content-${css}`],
      {
        [styles['fil-content-header-sortableasc']]:
          order === null && defaultOrder === 'asc',
        [styles['fil-content-header-sortabledesc']]:
          order === null && defaultOrder === 'desc',
        [styles['fil-content-header-sortasc']]: order === 'asc',
        [styles['fil-content-header-sortdesc']]: order === 'desc'
      }
    )}
  >
    {t(`table.head_${label}`)}
  </div>
)

const FileListHeader = ({ t, folderId, canSort, sort, onFolderSort }) => (
  <div
    className={classNames(
      styles['fil-content-head'],
      styles['fil-content-row-head']
    )}
  >
    <div
      className={classNames(
        styles['fil-content-header'],
        styles['fil-content-file-select']
      )}
    />
    {SORTABLE_ATTRIBUTES.map(props => {
      if (!canSort) {
        return <HeaderCell {...props} t={t} />
      }
      const actualSort = sort || DEFAULT_SORT
      const isActive = actualSort && actualSort.attribute === props.attr
      return (
        <SortableHeaderCell
          {...props}
          t={t}
          order={isActive ? actualSort.order : null}
          onSort={(attr, order) => onFolderSort(folderId, attr, order)}
        />
      )
    })}
    <div
      className={classNames(
        styles['fil-content-header'],
        styles['fil-content-size']
      )}
    >
      {t('table.head_size')}
    </div>
    <div
      className={classNames(
        styles['fil-content-header'],
        styles['fil-content-status']
      )}
    >
      {t('table.head_status')}
    </div>
  </div>
)

const mapStateToProps = state => ({
  sort: getSort(state),
  folderId: getOpenedFolderId(state)
})
const mapDispatchToProps = dispatch => ({
  onFolderSort: (folderId, attr, order) =>
    dispatch(sortFolder(folderId, attr, order))
})

export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(FileListHeader)
)
