import {
  isShortcut,
  isNote,
  isDocs,
  shouldBeOpenedByOnlyOffice,
  isDirectory
} from 'cozy-client/dist/models/file'
import { IOCozyFile } from 'cozy-client/types/types'

import type { File } from '@/components/FolderPicker/types'
import { TRASH_DIR_ID, SHARED_DRIVES_DIR_ID } from '@/constants/config'
import { joinPath } from '@/lib/path'
import { isNextcloudShortcut } from '@/modules/nextcloud/helpers'
import { makeOnlyOfficeFileRoute } from '@/modules/views/OnlyOffice/helpers'

interface ComputeFileTypeOptions {
  isOfficeEnabled?: boolean
  isPublic?: boolean
  cozyUrl?: string
}

interface ComputePathOptions {
  type: string
  pathname: string
  isPublic: boolean
}

interface FileAttribute {
  type: string
  name: string
  dir_id: string
  driveId: string
}

export const computeFileType = (
  file: File,
  {
    isOfficeEnabled = false,
    isPublic = false,
    cozyUrl = ''
  }: ComputeFileTypeOptions = {}
): string => {
  if (file._id === TRASH_DIR_ID) {
    return 'trash'
  } else if (file._id === 'io.cozy.remote.nextcloud.files.trash-dir') {
    return 'nextcloud-trash'
  } else if (
    file.dir_id === SHARED_DRIVES_DIR_ID &&
    !isNextcloudShortcut(file)
  ) {
    return 'shared-drive'
  } else if (file._type === 'io.cozy.remote.nextcloud.files') {
    return isDirectory(file) ? 'nextcloud-directory' : 'nextcloud-file'
  } else if (isNote(file)) {
    // createdOn url ends with a trailing slash whereas cozyUrl does not joinPath fixes this
    const isSameInstance =
      joinPath(cozyUrl, '') === file.cozyMetadata?.createdOn

    if (isPublic && isSameInstance) {
      return 'public-note-same-instance'
    } else if (isSameInstance) {
      return 'note'
    } else {
      return 'public-note'
    }
  } else if (isDocs(file)) {
    return 'docs'
  } else if (shouldBeOpenedByOnlyOffice(file) && isOfficeEnabled) {
    return 'onlyoffice'
  } else if (isNextcloudShortcut(file)) {
    return 'nextcloud'
  } else if (isShortcut(file)) {
    return 'shortcut'
  } else if (isDirectory(file)) {
    return 'directory'
  } else {
    return 'file'
  }
}

export const computeApp = (type: string): string => {
  switch (type) {
    case 'nextcloud-file':
      return 'nextcloud'
    case 'note':
    case 'public-note-same-instance':
      return 'notes'
    case 'docs':
      return 'docs'
    default:
      return 'drive'
  }
}

export const computePath = (
  file: File,
  { type, pathname, isPublic }: ComputePathOptions
): string => {
  const paths = pathname.split('/').slice(1)

  switch (type) {
    case 'trash':
      return '/trash'
    case 'nextcloud-trash':
      return `${pathname}/trash`
    case 'nextcloud':
      return `/nextcloud/${file.cozyMetadata?.sourceAccount ?? 'unknown'}`
    case 'nextcloud-directory':
      return `${pathname}?path=${file.path ?? '/'}`
    case 'nextcloud-file':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return file.links?.self ?? ''
    case 'note':
      return `/n/${file._id}`
    case 'public-note-same-instance':
      return `/?id=${file._id}`
    case 'public-note':
      return `/note/${file._id}`
    case 'docs':
      // eslint-disable-next-line no-case-declarations, @typescript-eslint/restrict-template-expressions
      return `/bridge/docs/${(file as IOCozyFile).metadata.externalId}`
    case 'shortcut':
      return `/external/${file._id}`
    case 'directory':
      // On mobile, if we are in /favorites tab, we do not want it to appears in computed path
      // so we redirect to root route for folders
      if (pathname.startsWith('/favorites')) {
        return `/folder/${file._id}`
      }
      // paths with only one element correspond to the root of a page like /sharings
      // when we add id we want to keep the path before to make /sharings/id
      return paths.length === 1 ? file._id : `../${file._id}`
    case 'onlyoffice':
      return makeOnlyOfficeFileRoute(file._id, {
        fromPathname: pathname,
        fromPublicFolder: isPublic
      })
    case 'shared-drive':
      return `/shareddrive/${(file.attributes as FileAttribute).driveId}/${
        file._id
      }`
    default:
      // On mobile, if we are in /favorites tab, we do not want it to appears in computed path
      // so we redirect to root route for files
      if (pathname.startsWith('/favorites')) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return `/folder/${file.dir_id}/file/${file._id}`
      }

      return `file/${file._id}`
  }
}
