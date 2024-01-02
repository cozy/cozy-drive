import { getLang } from './cozy-helper'
import {
  _polyglot,
  initTranslation
} from 'cozy-ui/transpiled/react/providers/I18n/translation'

// used when translating things outside of components, eg. native UIs
export const getTranslateFunction = () => {
  if (_polyglot === undefined) {
    const lang = getLang()
    const dictRequire = lang => require(`../../../locales/${lang}`)
    initTranslation(lang, dictRequire)
  }
  return _polyglot.t.bind(_polyglot)
}
