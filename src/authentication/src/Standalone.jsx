import React from 'react'
import { I18n } from 'cozy-ui/react'
import Authentication from './Authentication'
import Revoked from './Revoked'
import PropTypes from 'prop-types'

const withLocales = Wrapped => {
  const Wrapper = (props, context) => {
    const { lang } = context
    return (
      // Wrap into its own I18n to provide its own locales
      // We pluck a subset of the locales not to ship all Drive locales
      // when we distribute our component
      <I18n
        dictRequire={lang =>
          require(`!!./json-pluck-loader?key=mobile.onboarding;mobile.revoked!drive/locales/${lang}.json`)
        }
        lang={lang}
      >
        <Wrapped {...props} />
      </I18n>
    )
  }

  Wrapper.contextTypes = {
    lang: PropTypes.string.isRequired
  }

  return Wrapper
}

const StandaloneAuthentication = withLocales(Authentication)
const StandaloneRevoked = withLocales(Revoked)

export { StandaloneAuthentication as Authentication }
export { StandaloneRevoked as Revoked }
