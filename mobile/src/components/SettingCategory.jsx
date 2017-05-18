import React from 'react'
import styles from '../styles/settings'

export const ELEMENT_TEXT = 'ELEMENT_TEXT'
export const ELEMENT_CHECKBOX = 'ELEMENT_CHECKBOX'
export const ELEMENT_BUTTON = 'ELEMENT_BUTTON'

const SettingCategory = ({ title, elements }) => (
  <div>
    <h3 className={styles['settings__category-title']}>{title}</h3>
    {elements.map(element => (
      <div>
        {element.title && <h4 className={styles['settings__subcategory-title']}>{element.title}</h4>}
        {element.description && <p>{element.description}</p>}
        {element.type === ELEMENT_TEXT &&
          <div className={styles['settings__subcategory']}>
            <p className={styles['settings__subcategory__label']}>{element.label}</p>
            <p className={styles['settings__subcategory__item']} onClick={element.onClick}>{element.value}</p>
          </div>
        }
        {element.type === ELEMENT_CHECKBOX &&
          <div className={styles['settings__subcategory']}>
            <p for={element.id} className={styles['settings__subcategory__label']}>{element.label}</p>
            <p for={element.id} className={styles['settings__subcategory__item']}>
              <input id={element.id} type='checkbox' checked={element.checked} onChange={element.onChange} />
            </p>
          </div>
        }
        {element.type === ELEMENT_BUTTON &&
          <button className={element.className} onClick={element.onClick}>{element.text}</button>
        }
      </div>
    ))}
  </div>
)

export default SettingCategory
