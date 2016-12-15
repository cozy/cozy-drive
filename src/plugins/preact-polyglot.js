/**
 * preact plugin that provides Polyglot helper using a Higher Order Component.
 *
 */

'use strict'

/** @jsx h */
import { h, Component } from 'preact'
import Polyglot from 'node-polyglot'
import en from '../locales/en'

const init = function (context, lang) {
  const polyglot = new Polyglot({
    phrases: en,
    locale: 'en'
  })

  // Load global locales
  if (lang && lang !== 'en') {
    try {
      const dict = require(`../locales/${lang}`)
      polyglot.extend(dict)
      polyglot.locale(lang)
    } catch (e) {
      console.error(`The dict phrases for "${lang}" can't be loaded`)
    }
  }

  // Load context locales
  if (context) {
    try {
      const dict = require(`../contexts/${context}/locales/${lang}`)
      polyglot.extend(dict)
    } catch (e) {
      console.error(`The dict phrases for context "${context}" can't be loaded`)
    }
  }

  return polyglot
}

// Provider root component
export class I18n extends Component {
  constructor (props) {
    super(props)
    this.polyglot = init(props.context, props.lang)
  }

  getChildContext () {
    return { t: this.polyglot.t.bind(this.polyglot) }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.locale !== this.props.locale) {
      this.polyglot = init(newProps.context, newProps.lang)
    }
  }

  render ({children}) {
    return children && children[0] || null
  }
}

// higher order decorator for components that need `t`
export const translate = () => {
  return (WrappedComponent) => {
    const _translate = (props, context) => (
      <WrappedComponent {...props} t={context.t} />
    )
    return _translate
  }
}
