import React from 'react'
import { Layout } from 'cozy-ui/react/Layout'
import Alerter from 'cozy-ui/react/Alerter'

const PublicLayout = ({ t, children }) => (
  <Layout>
    <Alerter t={t} />
    {children}
  </Layout>
)

export default PublicLayout
