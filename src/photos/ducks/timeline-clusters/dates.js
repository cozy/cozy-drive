import { isThisYear } from 'date-fns'

export const formatH = (f, date) => {
  return f(date, 'HH')
}

export const formatD = (f, date) => {
  return f(date, 'DD')
}

export const formatDMY = (f, date) => {
  return f(date, 'DD MMMM') + addYear(f, date)
}

const addYear = (f, date) => {
  return isThisYear(date) ? '' : f(date, ' YYYY')
}
