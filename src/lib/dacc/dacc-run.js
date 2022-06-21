import log from 'cozy-logger'
import CozyClient from 'cozy-client'
import { schema } from 'drive/lib/doctypes'
import flag from 'cozy-flags'
import { endOfMonth, startOfMonth, format, subMonths } from 'date-fns'

import {
  aggregateFilesSize,
  aggregateNonExcludedSlugs,
  sendToRemoteDoctype
} from 'drive/lib/dacc/dacc'

/**
 * This service aggregates files size by createdByApps slug and send them to the DACC.
 * See https://github.com/cozy/DACC for more insights about the DACC.
 * The service relies on a flag that contains the following information:
 *   - measureName: the name of the dacc measure
 *   - remoteDoctype: the remote doctype to use
 *   - nonExcludedGroupLabel: when set, it is used to aggregate all the slugs not maching the excludedSlug
 *   - excludedSlug: used to exclude a slug from the total aggregation
 */
export const run = async () => {
  log('info', 'Start dacc service')

  const client = CozyClient.fromEnv(process.env, { schema })

  await flag.initialize(client)
  const daccFileSizeFlag = flag('drive.dacc-files-size-by-slug')
  if (!daccFileSizeFlag) {
    return
  }
  const {
    excludedSlug,
    nonExcludedGroupLabel,
    measureName,
    remoteDoctype,
    maxFileDateQuery
  } = daccFileSizeFlag

  const aggregationDate = new Date(
    maxFileDateQuery || endOfMonth(subMonths(new Date(), 1))
  ).toISOString()

  const sizesBySlug = await aggregateFilesSize(client, aggregationDate)
  if (Object.keys(sizesBySlug).length < 1) {
    log('info', `No files found to aggregate with date ${aggregationDate}`)
  }

  if (excludedSlug && nonExcludedGroupLabel) {
    const totalNonExcluded = aggregateNonExcludedSlugs(
      sizesBySlug,
      excludedSlug
    )
    sizesBySlug[nonExcludedGroupLabel] = totalNonExcluded
  }

  const startDateMeasure = format(startOfMonth(aggregationDate), 'YYYY-MM-DD')

  await sendToRemoteDoctype(client, remoteDoctype, sizesBySlug, {
    measureName,
    startDate: startDateMeasure
  })
}
