import React from 'react'

import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import Typography from 'cozy-ui/transpiled/react/Typography'

const CertificationTooltip = ({ body, caption, content }) => {
  return (
    <Tooltip
      title={
        <div className="u-p-half">
          <Typography variant="body1">{body}</Typography>
          <Typography variant="caption" color="textSecondary">
            {caption}
          </Typography>
        </div>
      }
    >
      <span className="u-w-100">{content}</span>
    </Tooltip>
  )
}

export default CertificationTooltip
