import {
  isThisYear,
  differenceInCalendarMonths,
  differenceInCalendarDays,
  differenceInHours,
  compareAsc
} from 'date-fns'

/**
 *  Format the date as specified by the formatter parameter.
 *  The extraction of year, day, etc is needed because the Date(string) constructor use the local timezone.
 *  Yet, the photos' dates are saved with the stack's locale (GMT+0 in production environment),
 *  because the timezone is mostly not specified in the EXIF metadata.
 *  So, to avoid a date offset in case the user timezone is not the stack's one, we use the Date(numbers) constructor instead.
 *  See https://github.com/date-fns/date-fns/issues/489 for more insights.
 * @param {function} f - date-fns format function
 * @param {string} date - date passed as string
 * @param {string} formatter - The wanted format. See https://date-fns.org/v1.30.1/docs/format
 * @returns {string} The formatted date
 */
const formatDate = (f, date, formatter) => {
  const [year, month, day] = date.substr(0, 10).split('-')
  const [hours, minutes, seconds] = date.substr(11, 8).split(':')
  return f(new Date(year, month - 1, day, hours, minutes, seconds), formatter)
}

export const formatH = (f, date) => {
  return formatDate(f, date, 'HH')
}

export const formatD = (f, date) => {
  return formatDate(f, date, 'DD')
}

export const formatDMY = (f, date) => {
  return formatDate(f, date, 'DD MMMM') + addYear(f, date)
}

export const formatYMD = (f, date) => {
  return formatDate(f, date, 'YYYY-MM-DD')
}

const addYear = (f, date) => {
  return isThisYear(date) ? '' : formatDate(f, date, ' YYYY')
}

export const isSameMonth = (f, newerDate, olderDate) => {
  const newer = formatDate(f, newerDate)
  const older = formatDate(f, olderDate)
  return differenceInCalendarMonths(newer, older) < 1
}

export const isSameDay = (f, newerDate, olderDate) => {
  const newer = formatDate(f, newerDate)
  const older = formatDate(f, olderDate)
  return differenceInCalendarDays(newer, older) < 1
}

export const isSameHour = (f, newerDate, olderDate) => {
  const newer = formatDate(f, newerDate)
  const older = formatDate(f, olderDate)
  return differenceInHours(newer, older) < 1
}

export const isEqualOrNewer = (newerDate, olderDate) => {
  return compareAsc(newerDate, olderDate) >= 0
}

export const isEqualOrOlder = (newerDate, olderDate) => {
  return compareAsc(newerDate, olderDate) <= 0
}
