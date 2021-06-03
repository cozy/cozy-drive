import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LockIcon from 'cozy-ui/transpiled/react/Icons/Lock'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'

const ReadOnly = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  if (isMobile)
    return (
      <div className="u-flex u-mr-1">
        <Icon
          data-testid="onlyoffice-readonly-icon-only"
          icon={LockIcon}
          color="var(--secondaryTextColor)"
        />
      </div>
    )

  return (
    <Tooltip title={t('OnlyOffice.readOnly.tooltip')}>
      <span className="u-flex u-mr-1">
        <Icon
          data-testid="onlyoffice-readonly-icon"
          icon={LockIcon}
          className="u-mr-half"
          color="var(--secondaryTextColor)"
        />
        <Typography
          data-testid="onlyoffice-readonly-text"
          variant="body1"
          color="textSecondary"
          className="u-c-default"
        >
          {t('OnlyOffice.readOnly.title')}
        </Typography>
      </span>
    </Tooltip>
  )
}

export default ReadOnly
