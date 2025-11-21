import { CozyClient } from 'cozy-client'

import { File } from '@/components/FolderPicker/types'

export interface PasteOperationOptions {
  showAlert?: (alert: { message: string; severity: string }) => void
  t?: (key: string, params?: Record<string, unknown>) => string
  sharingContext?: {
    getSharedParentPath?: (path: string) => string
    hasSharedParent?: (path: string) => boolean
    byDocId?: Record<string, unknown>
  }
  showMoveValidationModal?: (
    modalType: string,
    file: File,
    targetFolder: File,
    onConfirm: () => void,
    onCancel: () => void
  ) => void
  isPublic?: boolean
}

export interface PasteOperationResult {
  success: boolean
  file: File
  error?: Error
  operation: string
}

/**
 * Executes a move operation for files or folders.
 * Automatically detects if it's a shared drive operation and uses the appropriate API.
 *
 * @param client - The cozy client instance
 * @param entry - The file or folder to move
 * @param sourceDirectory - The source directory containing the entry
 * @param destDirectory - The destination directory
 * @param force - Whether to force the move operation
 * @returns The result of the move operation
 */
export function executeMove(
  client: CozyClient,
  entry: File,
  sourceDirectory: File,
  destDirectory: File,
  force?: boolean
): Promise<unknown>

/**
 * Executes a duplicate operation for files or folders.
 * Automatically detects if it's a shared drive operation and uses the appropriate API.
 *
 * @param client - The cozy client instance
 * @param entry - The file or folder to duplicate
 * @param sourceDirectory - The source directory containing the entry
 * @param destDirectory - The destination directory
 * @returns The result of the duplicate operation
 */
export function executeDuplicate(
  client: CozyClient,
  entry: File,
  sourceDirectory: File,
  destDirectory: File
): Promise<unknown>

/**
 * Handles paste operations (copy or cut) for multiple files/folders.
 * Processes each file individually and handles validation, conflicts, and sharing permissions.
 *
 * @param client - The cozy client instance
 * @param files - Array of files/folders to paste
 * @param operation - The paste operation ('copy' or 'cut')
 * @param sourceDirectory - The source directory containing the files
 * @param targetFolder - The target folder for the paste operation
 * @param options - Additional options
 * @returns Array of operation results with success/failure status
 */
export function handlePasteOperation(
  client: CozyClient,
  files: File[],
  operation: string | null,
  sourceDirectory: File,
  targetFolder: File,
  options?: PasteOperationOptions
): Promise<PasteOperationResult[]>
