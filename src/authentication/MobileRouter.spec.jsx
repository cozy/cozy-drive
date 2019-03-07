import { MobileRouter } from './MobileRouter'
import React from 'react'
import { shallow } from 'enzyme'
import { writeState, writeSecret } from './src/utils/onboarding'

describe('MobileRouter', () => {
  it('should render the appRoutes when all is well', () => {
    const app = shallow(
      <MobileRouter
        appRoutes={<div />}
        isAuthenticated={true}
        isRevoked={false}
        onboarding={{}}
        onboardingInformations={{}}
        history={{}}
        onAuthenticated={jest.fn()}
        onLogout={jest.fn()}
        appIcon={''}
      />
    )
    expect(app).toMatchSnapshot()
  })

  it('should render the appRoutes when no onboarding informations are present', () => {
    const app = shallow(
      <MobileRouter
        appRoutes={<div />}
        isAuthenticated={true}
        isRevoked={false}
        onboarding={{}}
        onboardingInformations={undefined}
        history={{}}
        onAuthenticated={jest.fn()}
        onLogout={jest.fn()}
        appIcon={''}
      />
    )
    expect(app).toMatchSnapshot()
  })

  it('should render the revoked view', () => {
    const app = shallow(
      <MobileRouter
        isAuthenticated={true}
        isRevoked={true}
        history={{}}
        onAuthenticated={jest.fn()}
        onLogout={jest.fn()}
        onboarding={{}}
        onboardingInformations={{}}
        appIcon={''}
        appRoutes={<div />}
      />
    )
    expect(app).toMatchSnapshot()
  })

  it('should render the auth screen when the onboarding has not started', () => {
    const onboardingInformations = {
      code: null,
      state: null,
      cozy_url: null
    }
    const app = shallow(
      <MobileRouter
        isAuthenticated={false}
        isRevoked={false}
        onboarding={{}}
        onboardingInformations={onboardingInformations}
        history={{}}
        onAuthenticated={jest.fn()}
        onLogout={jest.fn()}
        appIcon={''}
        appRoutes={<div />}
      />
    )
    expect(app).toMatchSnapshot()
  })

  it('should render nothing when onboarding', () => {
    const app = shallow(
      <MobileRouter
        client={jest.fn()}
        history={{}}
        isAuthenticated={false}
        isRevoked={false}
        onAuthenticated={jest.fn()}
        onLogout={jest.fn()}
        onboarding={{}}
        onboardingInformations={{ code: null }}
        appIcon={''}
        appRoutes={<div />}
      />
    )
    const instance = app.instance()
    const loginSpy = jest.spyOn(instance, 'doOnboardingLogin')
    const onboardingInformations = {
      code: '123',
      state: 'abc',
      cozy_url: 'http://lol.com'
    }

    app.setProps({
      onboardingInformations
    })

    expect(app).toMatchSnapshot()
    expect(loginSpy).toHaveBeenCalled()
  })

  describe('Auto Onboarding', () => {
    const onLogout = jest.fn()
    const onAuthenticated = jest.fn()
    const client = {
      stackClient: {
        fetchJSON: jest.fn(),
        fetch: jest.fn()
      }
    }
    const state = '123'
    const code = '111222333'
    const url = 'instance.cozy.test'
    const history = jest.fn()

    let app, instance

    beforeEach(() => {
      app = shallow(
        <MobileRouter
          client={client}
          history={{}}
          isAuthenticated={true}
          isRevoked={false}
          onAuthenticated={onAuthenticated}
          onLogout={onLogout}
          onboarding={{}}
          onboardingInformations={{}}
          appIcon={''}
          appRoutes={<div />}
        />
      )
      instance = app.instance()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should call logout when the local states are different', async () => {
      await writeState('456')

      await instance.doOnboardingLogin(state, code, url, history)
      expect(onLogout).toHaveBeenCalled()
    })

    it('should call logout when the exchanged secrets are different', async () => {
      await writeSecret('abc')
      await writeState('123')
      client.stackClient.fetchJSON.mockResolvedValue({
        onboarding_secret: 'def',
        onboarding_state: '456'
      })

      await instance.doOnboardingLogin(state, code, url, history)

      expect(client.stackClient.fetchJSON).toHaveBeenCalledTimes(1)
      expect(client.stackClient.fetchJSON.mock.calls[0][0]).toEqual('POST')
      expect(client.stackClient.fetchJSON.mock.calls[0][1]).toMatch(
        /\/auth\/secret_exchange$/
      )
      expect(onLogout).toHaveBeenCalled()
    })

    it('should call logout when the exchanged states are different', async () => {
      await writeSecret('abc')
      await writeState('123')
      client.stackClient.fetchJSON.mockResolvedValue({
        onboarding_secret: 'abc',
        onboarding_state: '456'
      })

      await instance.doOnboardingLogin(state, code, url, history)

      expect(client.stackClient.fetchJSON).toHaveBeenCalledTimes(1)
      expect(client.stackClient.fetchJSON.mock.calls[0][0]).toEqual('POST')
      expect(client.stackClient.fetchJSON.mock.calls[0][1]).toMatch(
        /\/auth\/secret_exchange$/
      )
      expect(onLogout).toHaveBeenCalled()
    })

    it('should fail when fetching the token produces an error', async () => {
      await writeSecret('abc')
      await writeState('123')
      client.stackClient.fetchJSON.mockResolvedValue({
        onboarding_secret: 'abc',
        onboarding_state: '123'
      })
      client.stackClient.fetch.mockRejectedValue({
        error: 'nope'
      })

      await instance.doOnboardingLogin(state, code, url, history)

      expect(client.stackClient.fetch).toHaveBeenCalledTimes(1)
      expect(client.stackClient.fetch.mock.calls[0][0]).toEqual('POST')
      expect(client.stackClient.fetch.mock.calls[0][1]).toMatch(
        /\/auth\/access_token/
      )
      expect(onLogout).toHaveBeenCalled()
    })

    it('should fail if the token cant be fetched', async () => {
      await writeSecret('abc')
      await writeState('123')
      client.stackClient.fetchJSON.mockResolvedValue({
        onboarding_secret: 'abc',
        onboarding_state: '123'
      })
      client.stackClient.fetch.mockResolvedValue({
        json: async () => {
          return {
            error: 'test error'
          }
        },
        status: 500
      })

      await instance.doOnboardingLogin(state, code, url, history)

      expect(client.stackClient.fetch).toHaveBeenCalledTimes(1)
      expect(client.stackClient.fetch.mock.calls[0][0]).toEqual('POST')
      expect(client.stackClient.fetch.mock.calls[0][1]).toMatch(
        /\/auth\/access_token/
      )
      expect(onLogout).toHaveBeenCalled()
    })

    it('should call onAuthenticated when everything worked', async () => {
      await writeSecret('abc')
      await writeState('123')
      client.stackClient.fetchJSON.mockResolvedValue({
        onboarding_secret: 'abc',
        onboarding_state: '123',
        clientInfo: 'test client'
      })
      client.stackClient.fetch.mockResolvedValue({
        json: async () => {
          return {
            error: null,
            value: 'secret token'
          }
        },
        status: 200
      })

      await instance.doOnboardingLogin(state, code, url, history)
      expect(onLogout).not.toHaveBeenCalled()
      expect(onAuthenticated).toHaveBeenCalledWith({
        url: 'https://' + url,
        token: {
          error: null,
          value: 'secret token'
        },
        clientInfo: {
          onboarding_secret: 'abc',
          onboarding_state: '123',
          clientInfo: 'test client'
        },
        router: history
      })
    })
  })
})
