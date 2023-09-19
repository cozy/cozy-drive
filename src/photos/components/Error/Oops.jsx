import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Button from 'cozy-ui/transpiled/react/Buttons'
import PhotosIcon from 'cozy-ui/transpiled/react/Icons/FileTypeImage'

const Oops = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const backHomepage = () => {
    navigate('/')
  }

  return (
    <Empty title={t('Error.generic')} icon={PhotosIcon}>
      <Button onClick={backHomepage} label={t('Error.back_homepage')} />
    </Empty>
  )
}

export default Oops
