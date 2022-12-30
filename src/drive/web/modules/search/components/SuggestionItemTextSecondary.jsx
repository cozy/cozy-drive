import React from 'react'

import styles from 'drive/web/modules/search/components/styles.styl'
import SuggestionItemTextHighlighted from 'drive/web/modules/search/components/SuggestionItemTextHighlighted'

const SuggestionItemTextSecondary = ({
  text,
  query,
  url,
  onOpened,
  isMobile
}) => {
  const handleClick = e => {
    e.stopPropagation()
    if (typeof onOpened == 'function') {
      onOpened(e)
    }
  }

  if (isMobile) {
    return <SuggestionItemTextHighlighted text={text} query={query} />
  }

  return (
    <a
      className={styles['suggestion-item-parent-link']}
      href={url}
      onClick={handleClick}
    >
      <SuggestionItemTextHighlighted text={text} query={query} />
    </a>
  )
}

export default SuggestionItemTextSecondary
