import React from 'react'

import { BarSearch } from 'cozy-bar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import BarSearchAutosuggest from 'modules/search/components/BarSearchAutosuggest'

const AppBarSearch = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return <BarSearch>{!isMobile && <BarSearchAutosuggest t={t} />}</BarSearch>
}

export default AppBarSearch
