import React from 'react'

import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout } from 'cozy-ui/transpiled/react/Layout'

const DummyLayout: React.FC = ({ children }) => {
  return (
    <Layout monoColumn={true}>
      {children}
      <Sprite />
    </Layout>
  )
}

export { DummyLayout }
