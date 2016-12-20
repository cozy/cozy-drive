import styles from '../styles/table'

import { h } from 'preact'
import { translate } from '../plugins/preact-polyglot'
import classNames from 'classnames'

const Table = ({ t }) => (
  <table class={ styles['fil-content-table'] } role="contentinfo">
    <thead>
      <tr>
        <th class={ styles['fil-content-file'] }>{ t('Name') }</th>
        <th>{ t('Last update') }</th>
        <th>{ t('Size') }</th>
        <th>{ t('Status') }</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-folder']) }>Documents</td>
        <td><time datetime="">{ t('Nov 1, 2015')} </time></td>
        <td>—</td>
        <td>—</td>
      </tr>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-folder']) }>Music</td>
        <td><time datetime="">{ t('Jul 14, 2016') }</time></td>
        <td>—</td>
        <td>{ t('Shared (Read only)') }</td>
      </tr>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-folder']) }>Photos</td>
        <td><time datetime="">{ t('Oct 7, 2016')} </time></td>
        <td>—</td>
        <td>{ t('Shared (read &amp; write)') }</td>
      </tr>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-text']) }>a job story example<span class={ styles['fil-content-ext'] }>.word</span></td>
        <td><time datetime="">{ t('Jul 14, 2016') }</time></td>
        <td>1.2 MB</td>
        <td>—</td>
      </tr>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-pdf']) }>2016 06 - A presentation to rule them all<span class={ styles['fil-content-ext'] }>.pdf</span></td>
        <td><time datetime="">{ t('Aug 22, 2015') }</time></td>
        <td>46 KB</td>
        <td>—</td>
      </tr>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-video']) }>Cooking - salmon_baked_with_love<span class={ styles['fil-content-ext'] }>.mp4</span></td>
        <td><time datetime="">{ t('Oct 7, 2016')} </time></td>
        <td>124 MB</td>
        <td>—</td>
      </tr>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-zip']) }>Finding Dory OST<span class={ styles['fil-content-ext'] }>.zip</span></td>
        <td><time datetime="">{ t('Aug 22, 2015') }</time></td>
        <td>182 MB</td>
        <td>—</td>
      </tr>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-pdf']) }>HeartRateTraining_FASTER_6weeks_US<span class={ styles['fil-content-ext'] }>.pdf</span></td>
        <td><time datetime="">{ t('Jul 14, 2016') }</time></td>
        <td>2.2 MB</td>
        <td>—</td>
      </tr>
      <tr>
        <td class={ classNames(styles['fil-content-file'], styles['fil-file-files']) }>principle animation prototype<span class={ styles['fil-content-ext'] }>.sketch</span></td>
        <td><time datetime="">{ t('Oct 7, 2016')} </time></td>
        <td>27 MB</td>
        <td>{ t('Shared (read only)') }</td>
      </tr>
    </tbody>
  </table>
)

export default translate()(Table)
