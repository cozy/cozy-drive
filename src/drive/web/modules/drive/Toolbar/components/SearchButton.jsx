import React, { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'

const SearchButton = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()

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
