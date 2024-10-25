import cx from 'classnames'
import get from 'lodash/get'
import { CozyFile } from 'models'
import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { isDirectory } from 'cozy-client/dist/models/file'
import flag from 'cozy-flags'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CarbonCopyIcon from 'cozy-ui/transpiled/react/Icons/CarbonCopy'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import { TableCell } from 'cozy-ui/transpiled/react/deprecated/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { TRASH_DIR_ID } from 'constants/config'
import RenameInput from 'modules/drive/RenameInput'

import styles from 'styles/filelist.styl'

export const CertificationsIcons = ({ attributes }) => {
  const isCarbonCopy = get(attributes, 'metadata.carbonCopy')
  const isElectronicSafe = get(attributes, 'metadata.electronicSafe')
  const slug = get(attributes, 'cozyMetadata.uploadedBy.slug')
  const client = useClient()

  // TODO To be removed when UI's AppIcon use getIconURL from Cozy-Client
  // instead of its own see https://github.com/cozy/cozy-ui/issues/1723
  const fetchIcon = useCallback(() => {
    return client.getStackClient().getIconURL({
      type: 'konnector',
      slug,
      priority: 'registry'
    })
  }, [client, slug])

  return (
    <div className={styles['fil-file-certifications']}>
      {(isCarbonCopy || isElectronicSafe) && (
        <span className={styles['fil-file-certifications--separator']}>
          {' - '}
        </span>
      )}
      {isCarbonCopy &&
        (isElectronicSafe ? (
          <span data-testid="certificationsIcons-carbonCopyIcon">
            <Icon
              icon={CarbonCopyIcon}
              className={`u-mr-half ${styles['fil-file-certifications--icon']}`}
            />
          </span>
        ) : (
          <span data-testid="certificationsIcons-carbonCopyAppIcon">
            <AppIcon
              app={slug}
              className={styles['fil-file-certifications--icon']}
              fetchIcon={fetchIcon}
              type="konnector"
            />
          </span>
        ))}
      {isElectronicSafe && (
        <span data-testid="certificationsIcons-electronicSafeAppIcon">
          <AppIcon
            app={slug}
            className={styles['fil-file-certifications--icon']}
            fetchIcon={fetchIcon}
            type="konnector"
          />
        </span>
      )}
    </div>
  )
}

const FileName = ({
  attributes,
  isRenaming,
  interactive,
  withFilePath,
  isMobile,
  formattedSize,
  formattedUpdatedAt,
  refreshFolderContent,
  isInSyncFromSharing
}) => {
  const { t } = useI18n()
  const classes = cx(
    styles['fil-content-cell'],
    styles['fil-content-file'],
    { [styles['fil-content-file-openable']]: !isRenaming && interactive },
    { [styles['fil-content-row-disabled']]: isInSyncFromSharing }
  )

  const { title, filename, extension } = useMemo(() => {
    const { filename, extension } = CozyFile.splitFilename(attributes)

    if (attributes._id === TRASH_DIR_ID) {
      return {
        title: t('FileName.trash'),
        filename: t('FileName.trash')
      }
    }

    if (attributes._id === 'io.cozy.files.shared-drives-dir') {
      return {
        title: t('FileName.sharedDrive'),
        filename: t('FileName.sharedDrive')
      }
    }

    if (
      attributes.cozyMetadata?.createdByApp === 'nextcloud' &&
      !flag('drive.hide-nextcloud-dev')
    ) {
      return {
        title: filename,
        filename: filename
      }
    }

    return {
      title: attributes.name,
      filename,
      extension
    }
  }, [attributes, t])

  return (
    <TableCell className={classes}>
      {isRenaming ? (
        <RenameInput
          file={attributes}
          refreshFolderContent={refreshFolderContent}
        />
      ) : (
        <div className={styles['fil-file']}>
          <div className={styles['fil-file-filename']}>
            <div className={styles['fil-file-filename-wrapper']}>
              <div
                data-testid="fil-file-filename-and-ext"
                className={styles['fil-file-filename-and-ext']}
                title={title}
              >
                {filename}
                {extension && (
                  <span className={styles['fil-content-ext']}>{extension}</span>
                )}
              </div>
            </div>
          </div>
          {withFilePath &&
            attributes.displayedPath &&
            (isMobile ? (
              <div
                className={styles['fil-file-description']}
                title={filename + extension}
              >
                <MidEllipsis
                  className={styles['fil-file-description--path']}
                  text={attributes.displayedPath}
                />
                <CertificationsIcons attributes={attributes} />
              </div>
            ) : (
              <Link
                to={`/folder/${attributes.dir_id}`}
                // Please do not modify the className as it is used in event handling, see FileOpener#46
                className={styles['fil-file-path']}
              >
                <MidEllipsis text={attributes.displayedPath} />
              </Link>
            ))}
          {!withFilePath &&
            (isDirectory(attributes) || (
              <div className={styles['fil-file-infos']}>
                {`${formattedUpdatedAt}${
                  formattedSize ? ` - ${formattedSize}` : ''
                }`}
                {isMobile && <CertificationsIcons attributes={attributes} />}
              </div>
            ))}
        </div>
      )}
    </TableCell>
  )
}

export default FileName
