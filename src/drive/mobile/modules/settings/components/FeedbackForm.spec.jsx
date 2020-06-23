import React from 'react'
import { mount } from 'enzyme'
import CozyClient from 'cozy-client'

import FeedbackForm, { FeedbackForm as DumbFeedbackForm } from './FeedbackForm'
import AppLike from 'test/components/AppLike'

describe('FeedbackForm', () => {
  const setup = () => {
    const client = new CozyClient({})
    const root = mount(
      <AppLike client={client}>
        <FeedbackForm onClose={jest.fn()} />
      </AppLike>
    )
    const component = root.find(DumbFeedbackForm)
    return { root, component, client }
  }

  it('should correctly send an email', () => {
    const { component, client } = setup()
    const createMock = jest.fn()
    client.collection = jest.fn(() => ({
      create: createMock
    }))
    const form = component.find('form')
    form.simulate('submit')
    expect(client.collection).toHaveBeenCalledWith('io.cozy.jobs')
    expect(createMock).toHaveBeenCalledWith(
      'sendmail',
      expect.objectContaining({
        subject: 'Feedback on Cozy Drive'
      })
    )
  })
})
