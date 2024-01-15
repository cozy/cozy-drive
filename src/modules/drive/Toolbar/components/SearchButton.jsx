import React, { useCallback } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const SearchButton = ({ navigate, pathname }) => {
  const { t } = useI18n()

  const goToSearch = useCallback(() => {
    navigate(`/search?returnPath=${pathname}`)
  }, [navigate, pathname])

  return (
    <IconButton onClick={goToSearch} aria-label={t('search.action')}>
      <Icon icon={Magnifier} />
    </IconButton>
  )
}

export default SearchButton
