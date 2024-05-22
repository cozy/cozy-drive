import cx from 'classnames'
import React from 'react'

import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { MoreMenu } from 'components/MoreMenu'
import { selectable } from 'modules/actions/selectable'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

const NextcloudToolbar = () => {
  const { t } = useI18n()
  const { showSelectionBar } = useSelectionContext()

  const moreActions = makeActions([selectable], { t, showSelectionBar })

  return (
    <div
      className={cx('u-flex', 'u-flex-items-center', 'u-ml-auto')}
      role="toolbar"
    >
      <MoreMenu actions={moreActions} docs={[]} disabled={false} />
    </div>
  )
}

export { NextcloudToolbar }
