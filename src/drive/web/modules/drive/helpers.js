import { makeStyles } from 'cozy-ui/transpiled/react/styles'

export const useFabStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    right: ({ right }) => (right ? right : '1rem'),
    bottom: ({ bottom }) => (bottom ? bottom : '1rem')
  }
}))
