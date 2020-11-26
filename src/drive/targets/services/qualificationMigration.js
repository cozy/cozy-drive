import log from 'cozy-logger'
import CozyClient, { Q } from 'cozy-client'
import { schema, DOCTYPE_FILES_SETTINGS } from 'drive/lib/doctypes'
import {
  migrateQualifiedFiles,
  extractFilesToMigrate,
  queryFilesFromDate,
  getMostRecentUpdatedDate
} from 'drive/lib/migration/qualification'
import fetch from 'node-fetch'

global.fetch = fetch

const BATCH_FILES_LIMIT = 1000 // to avoid processing too many files and get timeouts

/**
 * This services migrates files qualified with the old model.
 * The up-to-date qualification model is now saved [here](https://github.com/cozy/cozy-client/blob/master/packages/cozy-client/src/assets/qualifications.json)
 * This service queries files starting from the date saved in the settings
 * and evaluate for each f ile if some old qualification attributes exist
 * to migrate to the new qualification model.
 * Note we restrict the max file processing to BATCH_FILES_LIMIT to avoid
 * service time-out.
 */
export const migrateQualifications = async () => {
  log('info', 'Start qualification migration service')
  const client = CozyClient.fromEnv(process.env, { schema })

  // Get last processed file date from the settings
  const filesSettings = await client.query(Q(DOCTYPE_FILES_SETTINGS).limitBy(1))
  const settings =
    filesSettings && filesSettings.data.length > 0
      ? filesSettings.data[0]
      : null
  let lastProcessedFileDate = null
  if (settings) {
    lastProcessedFileDate = settings.lastProcessedFileDate
  }
  // Get a batch of sorted files starting from the date
  const filesByDate = await queryFilesFromDate(
    client,
    lastProcessedFileDate,
    BATCH_FILES_LIMIT
  )
  if (filesByDate.length < 1) {
    log('warn', 'No new file to process')
    return
  }
  lastProcessedFileDate =
    filesByDate[filesByDate.length - 1].cozyMetadata.updatedAt

  // Filter the files with old qualification attributes
  const filesToMigrate = extractFilesToMigrate(filesByDate)

  if (filesToMigrate.length < 1) {
    log('info', 'No file found with old qualification')
  } else {
    const migratedFiles = await migrateQualifiedFiles(client, filesToMigrate)
    log(
      'info',
      `Migrated ${migratedFiles.length} files with old qualifications`
    )
    lastProcessedFileDate =
      getMostRecentUpdatedDate(migratedFiles) || lastProcessedFileDate
  }

  // Save the last processed file date in the settings
  log('info', `Save last processed file date: ${lastProcessedFileDate}`)
  if (settings) {
    await client.save({ ...settings, lastProcessedFileDate })
  } else {
    await client.create(DOCTYPE_FILES_SETTINGS, { lastProcessedFileDate })
  }
}

migrateQualifications().catch(e => {
  log('critical', e)
  process.exit(1)
})
