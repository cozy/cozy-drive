import styles from '../styles/loading'

import React from 'react'

export const Loading = ({ t, loadingType }) => {
  return (
    <div class={styles['pho-loading']}>
      <p>{t(`Loading.${loadingType}`)}</p>
    </div>
  )
}

export default Loading
