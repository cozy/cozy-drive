import React from 'react'
import ErrorShare from 'components/Error/ErrorShare'
import { Main } from 'cozy-ui/transpiled/react/Layout'
import styles from '../targets/public/index.styl'
import classNames from 'classnames'

const ErrorUnsharedComponent = () => (
  <div
    data-testid="pho-public-layout"
    className={classNames(
      styles['pho-public-layout'],
      styles['pho-public-layout--full'],
      'u-pt-3'
    )}
  >
    <Main className="u-pt-1-half">
      <ErrorShare errorType={`public_album_unshared`} />
    </Main>
  </div>
)

export default ErrorUnsharedComponent
