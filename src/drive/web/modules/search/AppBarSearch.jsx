import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { BarSearch } from 'components/Bar'
import BarSearchAutosuggest from 'drive/web/modules/search/components/BarSearchAutosuggest'

const AppBarSearch = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return <BarSearch>{!isMobile && <BarSearchAutosuggest t={t} />}</BarSearch>
}

export default AppBarSearch
