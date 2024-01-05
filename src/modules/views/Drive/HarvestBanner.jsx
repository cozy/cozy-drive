import PropTypes from 'prop-types'
import React from 'react'

import { useQuery, isQueryLoading, Q } from 'cozy-client'
import { LaunchTriggerCard } from 'cozy-harvest-lib'
import Divider from 'cozy-ui/transpiled/react/Divider'

import {
  buildTriggersQueryByAccountId,
  buildFileByIdQuery
} from 'modules/queries'
import useDocument from 'components/useDocument'

const HarvestBanner = ({ folderId }) => {
  const folder = useDocument('io.cozy.files', folderId)

  let konnectorSlug = undefined
  let accountId = undefined

  const fileId = folder?.relationships?.contents?.data?.[0]?.id
  const fileQuery = buildFileByIdQuery(fileId)
  const file = useQuery(fileQuery.definition, {
    ...fileQuery.options,
    enabled: Boolean(fileId)
  })
  if (file.data) {
    konnectorSlug = file.data.cozyMetadata?.createdByApp
    accountId = file.data.cozyMetadata?.sourceAccount
  }
  const queryTriggers = buildTriggersQueryByAccountId(
    accountId,
    Boolean(accountId)
  )
  const { data: triggers, ...triggersQueryLeft } = useQuery(
    queryTriggers.definition,
    queryTriggers.options
  )
  const isTriggersLoading = isQueryLoading(triggersQueryLeft)
  const konnector = useQuery(
    Q('io.cozy.konnectors').getById(
      `io.cozy.konnectors/${konnectorSlug}` || ' '
    ),
    {
      as: `io.cozy.konnectors/${konnectorSlug}`,
      enabled: Boolean(konnectorSlug),
      singleDocData: true
    }
  )
  if (!konnector.data || konnector.data.length === 0 || isTriggersLoading) {
    return null
  }
  return (
    <>
      <LaunchTriggerCard
        flowProps={{
          initialTrigger: triggers[0],
          konnector: konnector.data
        }}
        konnectorRoot={`harvest/${konnectorSlug}`}
      />
      <Divider />
    </>
  )
}

HarvestBanner.propTypes = {
  folderId: PropTypes.string.isRequired
}

export default HarvestBanner
