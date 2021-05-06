import React from 'react'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'

import { useRouter } from 'drive/lib/RouterContext'

const BackButton = () => {
  const { router } = useRouter()

  return (
    <IconButton onClick={() => router.goBack()}>
      <Icon icon={PreviousIcon} />
    </IconButton>
  )
}

export default BackButton
