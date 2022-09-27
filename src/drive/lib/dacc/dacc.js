import { queryFilesByDate } from 'drive/lib/dacc/query'
import { queryAllDocsWithFields } from 'drive/lib/dacc/query'
import log from 'cozy-logger'

const sendMeasureToDACC = async (client, remoteDoctype, measure) => {
  try {
    await client
      .getStackClient()
      .fetchJSON('POST', `/remote/${remoteDoctype}`, {
        data: JSON.stringify(measure),
        path: 'measure'
      })
  } catch (error) {
    log(
      'error',
      `Error while sending measure to remote doctype: ${error.message}`
    )
    throw error
  }
}

/**
 * Send measures to a remote doctype
 *
 * @param {object} client - The CozyClient instance
 * @param {string} remoteDoctype - The remote doctype to use
 * @param {object} sizesBySlug - The hash table of values by slug
 * @param {{startDate, measureName}} params - The measure params
 */
export const sendToRemoteDoctype = async (
  client,
  remoteDoctype,
  sizesBySlug,
  { startDate, measureName }
) => {
  const slugs = Object.keys(sizesBySlug)
  log(
    'info',
    `Send ${slugs.length} measures ${measureName} on ${startDate} to ${remoteDoctype}...`
  )
  for (const slug of slugs) {
    const measure = {
      createdBy: 'drive',
      measureName,
      startDate,
      value: sizesBySlug[slug],
      groups: [{ slug: slug }]
    }
    await sendMeasureToDACC(client, remoteDoctype, measure)
  }
}

const convertFileSizeInMB = file => {
  // The size is converted in MB to avoid too large values
  return parseInt(file.size) / (1000 * 1000) // Size in million of Bytes (MB)
}

/**
 * Aggregate values by slug
 *
 * @param {object} client - The CozyClient instance
 * @param {string} endDate - The max file date to query
 * @returns {object} The hash table of values by slug
 */
export const aggregateFilesSize = async (client, endDate) => {
  let hasNext = true
  let bookmark
  const sizesBySlug = {}
  while (hasNext) {
  const sizesBySlug = {
    trashed: 0
  }
  const resp = await queryAllDocsWithFields(client)

  for (const entry of resp) {
    const file = entry.doc
    if (
      file.type !== 'file' ||
      new Date(file.cozyMetadata.uploadedAt) > endDate
    ) {
      // Skip this doc
      continue
    }
    const slug = file.cozyMetadata?.createdByApp || 'unknown'
    const sizeMB = convertFileSizeInMB(file)

    if (file.trashed) {
      // Special case for trashed files
      sizesBySlug.trashed += sizeMB
    } else {
      if (slug in sizesBySlug) {
        sizesBySlug[slug] += sizeMB
      } else {
        sizesBySlug[slug] = sizeMB
      }
    }
  }

    if (!resp || !resp.next) {
      hasNext = false
    }
    bookmark = resp.bookmark
  }

  return sizesBySlug
}

/**
 * Aggregate all values except for excluded slug
 *
 * @param {object} sizesBySlug - The hash table of values by slug
 * @param {string} exclusionSlug - The slug to exclude
 */
export const aggregateNonExcludedSlugs = (sizesBySlug, exclusionSlug) => {
  let totalSize = 0
  for (const slug of Object.keys(sizesBySlug)) {
    if (!slug.includes(exclusionSlug) && slug !== 'trashed') {
      totalSize += sizesBySlug[slug]
    }
  }
  return totalSize
}
