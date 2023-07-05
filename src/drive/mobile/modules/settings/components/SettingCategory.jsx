import React from 'react'
import { Button } from 'cozy-ui/transpiled/react/deprecated/Button'
import Toggle from 'cozy-ui/transpiled/react/Toggle'

import styles from '../styles.styl'
export const ELEMENT_TEXT = 'ELEMENT_TEXT'
export const ELEMENT_CHECKBOX = 'ELEMENT_CHECKBOX'
export const ELEMENT_BUTTON = 'ELEMENT_BUTTON'

const SettingCategory = ({ title, elements }) => (
  <div className={styles['settings__category']}>
    <h3 className={styles['settings__category-title']}>{title}</h3>
    {elements.map((element, index) =>
      element.display === false ? (
        ''
      ) : (
        <div key={index}>
          {element.title && (
            <h4 className={styles['settings__subcategory-title']}>
              {element.title}
            </h4>
          )}
          {element.description && (
            <p className={styles['settings__subcategory__label']}>
              {element.description}
            </p>
          )}
          {element.type === ELEMENT_TEXT && (
            <div className={styles['settings__subcategory']}>
              <p className={styles['settings__subcategory__label']}>
                {element.label}
              </p>
              <p
                className={styles['settings__subcategory__item']}
                onClick={element.onClick}
              >
                {element.value}
              </p>
            </div>
          )}
          {element.type === ELEMENT_CHECKBOX && (
            <div className={styles['settings__subcategory']}>
              <label
                htmlFor={element.id}
                className={styles['settings__subcategory__label']}
              >
                {element.label}
              </label>
              <label
                htmlFor={element.id}
                className={styles['settings__subcategory__item']}
              >
                <Toggle
                  id={element.id}
                  checked={element.checked}
                  onToggle={element.onChange}
                />
              </label>
            </div>
          )}
          {element.type === ELEMENT_BUTTON && (
            <Button
              busy={element.busy}
              theme={element.theme}
              onClick={element.onClick}
              className={styles['settings__button']}
              label={element.text}
            />
          )}
        </div>
      )
    )}
  </div>
)

export default SettingCategory
