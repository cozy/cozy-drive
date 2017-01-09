/**
 * preact plugin that provides Polyglot and date-fns helpers using a Higher Order Component.
 *
 */

'use strict'

import React, { Component } from 'react'
import Polyglot from 'node-polyglot'
import format from 'date-fns/format'
import en from '../locales/en'

const initPolyglot = (context, lang) => {
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
      console.warn(`The dict phrases for "${lang}" can't be loaded`)
    }
  }

  // Load context locales
  if (context) {
    const dict = require(`../contexts/${context}/locales/${lang}`)
    polyglot.extend(dict)
  }

  return polyglot
}

const initFormat = lang => {
  const locales = {
    en: require('date-fns/locale/en')
  }
  if (lang && lang !== 'en') {
    try {
      locales[lang] = require(`date-fns/locale/${lang}`)
    } catch (e) {
      console.warn(`The "${lang}" locale isn't supported by date-fns`)
    }
  }
  return (date, formatStr) => format(date, formatStr, { locale: locales[lang] })
}

// Provider root component
export class I18n extends Component {
  constructor (props) {
    super(props)
    this.polyglot = initPolyglot(props.context, props.lang)
    this.format = initFormat(props.lang)
  }

  getChildContext () {
    return {
      t: this.polyglot.t.bind(this.polyglot),
      f: this.format
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.locale !== this.props.locale) {
      this.polyglot = initPolyglot(newProps.context, newProps.lang)
      this.format = initFormat(newProps.lang)
    }
  }

  render () {
    return this.props.children && this.props.children[0] || null
  }
}

I18n.childContextTypes = {
  t: React.PropTypes.func,
  f: React.PropTypes.func
}

// higher order decorator for components that need `t` and/or `f`
export const translate = () => {
  return (WrappedComponent) => {
    const _translate = (props, context) => (
      <WrappedComponent {...props} t={context.t} f={context.f} />
    )
    return _translate
  }
}
