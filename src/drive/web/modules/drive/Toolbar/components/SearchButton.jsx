import React, { useCallback } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'

import { useRouter } from 'drive/lib/RouterContext'

const SearchButton = () => {
  const { t } = useI18n()
  const { router } = useRouter()

  const goToSearch = useCallback(() => {
    router.push(`/search?returnPath=${router.location.pathname}`)
  }, [router])

  return (
    <IconButton onClick={goToSearch} aria-label={t('search.action')}>
      <Icon icon={Magnifier} />
    </IconButton>
  )
}

export default SearchButton
