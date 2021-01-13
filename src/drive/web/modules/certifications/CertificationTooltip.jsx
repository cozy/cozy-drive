import React from 'react'

import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import Typography from 'cozy-ui/transpiled/react/Typography'

const CertificationTooltip = ({ body, caption, content }) => {
  return (
    <Tooltip
      title={
        <>
          <Typography variant="body1" color="inherit">
            {body}
          </Typography>
          <Typography variant="caption" color="inherit">
            {caption}
          </Typography>
        </>
      }
    >
      <span className="u-w-100">{content}</span>
    </Tooltip>
  )
}

export default CertificationTooltip
