import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Grid from 'cozy-ui/transpiled/react/MuiCozyTheme/Grid'

import searchEmptyIllustration from 'drive/assets/icons/icon-search-empty.svg'

const SearchEmpty = ({ query }) => {
  const { t } = useI18n()

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      className="u-m-auto u-maw-5 u-ta-center"
      spacing={1}
    >
      <Grid item>
        <Icon
          width={96}
          height={96}
          icon={searchEmptyIllustration}
          aria-hidden="true"
        />
      </Grid>
      <Grid item>
        <Typography variant="h3">
          {t('search.empty.title', { query })}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          {t('search.empty.subtitle', { query })}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default SearchEmpty
