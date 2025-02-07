import React, { useEffect, useState } from 'react'

import { useClient } from 'cozy-client'
import Intents from 'cozy-interapp'

import Embeder from './Embeder'
import URLGetter from './URLGetter'

const IntentHandler = ({ intentId }) => {
  const client = useClient()

  const [state, setState] = useState({
    component: null,
    service: null,
    intent: null
  })

  const ServiceComponent = state.component

  useEffect(() => {
    const startService = async () => {
      let component
      let service
      let intent
      try {
        const intents = new Intents({ client })
        service = await intents.createService(intentId, window)
        intent = service.getIntent()

        if (
          intent.attributes.action === 'OPEN' &&
          intent.attributes.type === 'io.cozy.files'
        ) {
          component = Embeder
        } else if (intent.attributes.action === 'GET_URL') {
          component = URLGetter
        }

        setState({
          component,
          service,
          intent
        })
      } catch (error) {
        console.error(error)
        service.throw(error)
      }
    }

    startService()
  }, [client, intentId])

  return ServiceComponent ? (
    <ServiceComponent service={state.service} intent={state.intent} />
  ) : (
    <div className="u-w-100 u-bg-charcoalGrey" />
  )
}

export default IntentHandler
