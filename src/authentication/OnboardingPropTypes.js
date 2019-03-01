import Proptypes from 'prop-types'

export const onboardingInformationsPropTypes = Proptypes.shape({
  code: Proptypes.string,
  state: Proptypes.string,
  cozy_url: Proptypes.string
})

export const onboardingPropTypes = Proptypes.shape({
  auth: Proptypes.shape({
    clientKind: Proptypes.string.isRequired,
    clientName: Proptypes.string.isRequired,
    clientURI: Proptypes.string.isRequired,
    logoURI: Proptypes.string.isRequired,
    policyURI: Proptypes.string.isRequired,
    redirectURI: Proptypes.string.isRequired,
    scope: Proptypes.array.isRequired,
    softwareID: Proptypes.string.isRequired,
    softwareVersion: Proptypes.string.isRequired
  })
})
