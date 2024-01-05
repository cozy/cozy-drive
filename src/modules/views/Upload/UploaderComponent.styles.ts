import { Theme } from '@material-ui/core'

export const styles = (theme: Theme): Record<string, unknown> => ({
  paper: {
    height: '100%',
    '& .MuiDialogContent-root': {
      padding: '0'
    },
    '& .MuiDialogTitle-root': {
      padding: '0',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        overflow: 'visible',
        // back button
        '& .MuiButtonBase-root': {
          display: 'none'
        }
      }
    }
  }
})
