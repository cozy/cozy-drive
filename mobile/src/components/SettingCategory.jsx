import React from 'react'
import styles from '../styles/settings'

export const ELEMENT_TEXT = 'ELEMENT_TEXT'

const SettingCategory = ({ title, elements }) => (
  <div>
    <h3 className={styles['settings__category-title']}>{title}</h3>
    {elements.map(element => (
      <div>
        {element.title && <h4 className={styles['settings__subcategory-title']}>{element.title}</h4>}

        {element.type === ELEMENT_TEXT && <div className={styles['settings__subcategory']}>
          <p className={styles['settings__subcategory__label']}>{element.label}</p>
          <p className={styles['settings__subcategory__item']} onClick={element.onClick}>{element.value}</p>
        </div>}

      </div>
    ))}
  </div>
)

export default SettingCategory
