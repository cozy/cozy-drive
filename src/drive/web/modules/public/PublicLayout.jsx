import React from 'react'
import { Layout } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { IconSprite } from 'cozy-ui/transpiled/react'

const PublicLayout = ({ t, children }) => (
  <Layout>
    <Alerter t={t} />
    {children}
    <IconSprite />
  </Layout>
)

export default PublicLayout
