import styles from '../styles/table'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import { sortFolder, getOpenedFolderId } from '../actions'
import { getSort } from '../reducers'

const sortableAttrs = [
  { label: 'name', attr: 'name', css: 'file' },
  { label: 'update', attr: 'updated_at', css: 'date' },
  { label: 'size', attr: 'size', css: 'size' }
]

const SortableHeaderCell = ({ t, label, attr, css, order = null, onClick }) => (
  <div
    onClick={onClick}
    className={classNames(
      styles['fil-content-header'],
      styles[`fil-content-${css}`],
      {
        [styles['fil-content-header-sortable']]: order === null,
        [styles['fil-content-header-sortasc']]: order === 'asc',
        [styles['fil-content-header-sortdesc']]: order === 'desc'
      }
    )}
  >
    {t(`table.head_${label}`)}
  </div>
)

const FileListHeader = ({ t, folderId, sort, onFolderSort }) => (
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
    {sortableAttrs.map(props => {
      const isActive = sort && sort.attribute === props.attr
      return (
        <SortableHeaderCell
          {...props}
          t={t}
          order={isActive ? sort.order : null}
          onClick={() =>
            onFolderSort(
              folderId,
              props.attr,
              isActive && sort.order === 'desc' ? 'asc' : 'desc'
            )
          }
        />
      )
    })}
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

// {/* <div
//       className={classNames(
//         styles['fil-content-header'],
//         styles['fil-content-header-sortable'],
//         styles['fil-content-file']
//       )}
//     >
//       {t('table.head_name')}
//     </div>
//     <div
//       className={classNames(
//         styles['fil-content-header'],
//         styles['fil-content-header-sortasc'],
//         styles['fil-content-date']
//       )}
//     >
//       {t('table.head_update')}
//     </div>
//     <div
//       className={classNames(
//         styles['fil-content-header'],
//         styles['fil-content-header-sortdesc'],
//         styles['fil-content-size']
//       )}
//     >
//       {t('table.head_size')}
//     </div> */}

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
