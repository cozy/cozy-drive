import React from 'react'
import { Layout } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { IconSprite } from 'cozy-ui/transpiled/react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const PublicLayout = ({ children }) => {
  const { t } = useI18n()
  return (
    <Layout>
      <Alerter t={t} />
      {children}
      <IconSprite />
    </Layout>
  )
}

export default PublicLayout
