import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'
import { HarvestRoutes } from 'cozy-harvest-lib'
import datacardOptions from 'cozy-harvest-lib/dist/datacards/datacardOptions'

import {
  buildTriggersQueryByKonnectorSlug,
  buildKonnectorsQueryById
} from 'queries'

const KonnectorRoutes = () => {
  const { konnectorSlug } = useParams()
  const navigate = useNavigate()

  const queryTriggers = buildTriggersQueryByKonnectorSlug(konnectorSlug)
  const { data: triggers } = useQuery(
    queryTriggers.definition,
    queryTriggers.options
  )
  const trigger = triggers?.[0]

  const queryKonnector = buildKonnectorsQueryById({
    id: `io.cozy.konnectors/${konnectorSlug}`,
    enabled: Boolean(trigger)
  })
  const { data: konnectors } = useQuery(
    queryKonnector.definition,
    queryKonnector.options
  )
  const konnector = konnectors?.[0]

  const konnectorWithTriggers = konnector
    ? { ...konnector, triggers: { data: triggers } }
    : undefined

  const onDismiss = () => navigate('..')

  return (
    <HarvestRoutes
      konnector={konnectorWithTriggers}
      konnectorSlug={konnectorSlug}
      datacardOptions={datacardOptions}
      onSuccess={onDismiss}
      onDismiss={onDismiss}
      konnectorRoot={`harvest/${konnectorSlug}`}
    />
  )
}

export { KonnectorRoutes }
