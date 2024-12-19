import endOfMonth from 'date-fns/endOfMonth'
import format from 'date-fns/format'
import startOfMonth from 'date-fns/startOfMonth'
import subMonths from 'date-fns/subMonths'

import CozyClient from 'cozy-client'
import flag from 'cozy-flags'
import log from 'cozy-logger'

import { aggregateFilesSize, sendToRemoteDoctype } from 'lib/dacc/dacc'
import { schema } from 'lib/doctypes'

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
  )

  const sizesBySlug = await aggregateFilesSize(client, aggregationDate, {
    excludedSlug,
    nonExcludedGroupLabel
  })
  if (Object.keys(sizesBySlug).length < 1) {
    log(
      'info',
      `No files found to aggregate with date ${aggregationDate.toISOString()}`
    )
  }

  const startDateMeasure = format(startOfMonth(aggregationDate), 'yyyy-LL-dd')

  await sendToRemoteDoctype(client, remoteDoctype, sizesBySlug, {
    measureName,
    startDate: startDateMeasure
  })
}
