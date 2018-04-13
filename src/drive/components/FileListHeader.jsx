import styles from '../styles/table'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import { sortFolder, getOpenedFolderId } from '../actions'
import { getSort } from '../reducers'

const sortableAttrs = [
  { label: 'name', attr: 'name', css: 'file' },
  { label: 'update', attr: 'updated_at', css: 'date' }
]

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
    {sortableAttrs.map(props => {
      if (!canSort) {
        return <HeaderCell {...props} t={t} />
      }
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
