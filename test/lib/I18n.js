'use strict'

import { I18n } from '../../src/I18n'

const I18nComponent = new I18n({ lang: 'en' })

export const mockT = I18nComponent.polyglot.t.bind(I18nComponent.polyglot)

export const mockF = I18nComponent.format
