import React from 'react'
import { Link } from 'react-router-dom'

import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/filelist.styl'

import CertificationsIcons from '@/modules/filelist/cells/CertificationsIcons.jsx'
import { getFileNameAndExtension } from '@/modules/filelist/helpers'

const FileNamePath = ({
  attributes,
  withFilePath,
  formattedSize,
  formattedUpdatedAt,
  parentFolderPath
}) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { filename, extension } = getFileNameAndExtension(attributes, t)

  if (!withFilePath) {
    return (
      <div className={styles['fil-file-infos']}>
        {`${formattedUpdatedAt}${formattedSize ? ` - ${formattedSize}` : ''}`}
        <CertificationsIcons attributes={attributes} />
      </div>
    )
  }

  if (isMobile) {
    return (
      <div
        className={styles['fil-file-description']}
        title={filename + extension}
      >
        <MidEllipsis
          className={styles['fil-file-description--path']}
          text={parentFolderPath}
        />
        <CertificationsIcons attributes={attributes} />
      </div>
    )
  }

  return (
    <Link
      to={`/folder/${attributes.dir_id}`}
      // Please do not modify the className as it is used in event handling, see FileOpener
      className={styles['fil-file-path']}
    >
      <MidEllipsis text={parentFolderPath} />
    </Link>
  )
}

export default FileNamePath
