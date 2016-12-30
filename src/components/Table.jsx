import styles from '../styles/table'

import React from 'react'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

const Table = ({ t, f, files = [] }) => (
  <table class={styles['fil-content-table']} role='contentinfo'>
    <thead>
      <tr>
        <th class={styles['fil-content-file']}>{ t('table.head_name') }</th>
        <th>{ t('table.head_update') }</th>
        <th>{ t('table.head_size') }</th>
        <th>{ t('table.head_status') }</th>
      </tr>
    </thead>
    <tbody>
      {files.map(file => (
        <tr>
          <td class={classNames(styles['fil-content-file'], styles['fil-file-folder'])}>
            {file.name}
          </td>
          <td>
            <time datetime=''>{ f(file.created_at, 'MMM D, YYYY') }</time>
          </td>
          <td>—</td>
          <td>—</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default translate()(Table)
