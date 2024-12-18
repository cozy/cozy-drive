import React from 'react'

import { BarSearch } from 'cozy-bar'
import { AssistantDesktop } from 'cozy-dataproxy-lib'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const AppBarSearch = () => {
  const { isMobile } = useBreakpoints()

  return (
    <BarSearch>
      {!isMobile && (
        <div className="u-flex-grow u-mh-2">
          <AssistantDesktop
            componentsProps={{ SearchBarDesktop: { size: 'small' } }}
          />
        </div>
      )}
    </BarSearch>
  )
}

export default AppBarSearch
