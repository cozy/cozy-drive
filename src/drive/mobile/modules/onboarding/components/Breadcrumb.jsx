import React from 'react'

import styles from '../styles.styl'

const Breadcrumb = ({ currentStep, totalSteps }) => {
  const elementsArray = []
  for (let i = 0; i < totalSteps; i++) {
    let elementClass = ''
    if (i + 1 === currentStep) {
      elementClass = styles['onboarding-breadcrumb-element-active']
    } else {
      elementClass = styles['onboarding-breadcrumb-element']
    }
    elementsArray[i] = <div className={elementClass} key={`step${i}`} />
  }
  return (
    <div className={styles['onboarding-breadcrumb']}>
      {elementsArray.map(e => e)}
    </div>
  )
}

export default Breadcrumb
