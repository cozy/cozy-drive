// @ts-check
import { queryAllDocsWithFields } from 'drive/lib/dacc/query'
import log from 'cozy-logger'

/**
 * @typedef {object} Measure
 * See https://github.com/cozy/DACC for more insights
 *
 * @property {string} [createdBy] - The app slug that created the measure
 * @property {string} [measureName] - The measure name
 * @property {string} [startDate] - The startDate of the aggregation
 * @property {number} [value] - The measure value
 * @property {Array<object>} [groups] - The measure groups
 */

const sendMeasureToDACC = async (client, remoteDoctype, measure) => {
  try {
    log('info', `Send ${JSON.stringify(measure)} to ${remoteDoctype}`)
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
 * Aggregate file size values by slug
 *
 * @param {object} client - The CozyClient instance
 * @param {Date} endDate - The max file date to query
 * @returns {Promise<object>} The hash table of values by slug
 */
export const aggregateFilesSize = async (
  client,
  endDate,
  { excludedSlug = '', nonExcludedGroupLabel = '' } = {}
) => {
  const sizesBySlug = {
    trashed: 0
  }
  const resp = await queryAllDocsWithFields(client)

  for (const entry of resp) {
    const file = entry.doc
    const uploadedAt = new Date(file?.cozyMetadata?.uploadedAt || Date.now())
    if (file.type !== 'file' || uploadedAt > endDate) {
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

  if (excludedSlug && nonExcludedGroupLabel) {
    // Aggregate values
    const totalNonExcluded = aggregateNonExcludedSlugs(
      sizesBySlug,
      excludedSlug
    )
    sizesBySlug[nonExcludedGroupLabel] = totalNonExcluded
  }
  // Round values
  for (const slug of Object.keys(sizesBySlug)) {
    sizesBySlug[slug] = Math.round(sizesBySlug[slug] * 1000) / 1000
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
