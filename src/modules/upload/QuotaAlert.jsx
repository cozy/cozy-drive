import React from 'react'

import { default as UIQuotaAlert } from 'cozy-ui/transpiled/react/deprecated/QuotaAlert'

const QuotaAlert = ({ onClose }) => {
  return <UIQuotaAlert onClose={onClose} />
}

export default QuotaAlert
