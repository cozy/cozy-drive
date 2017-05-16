export const getPhotosByMonth = photos => {
  let months = {}
  photos.forEach(p => {
    // here we want to get an object whose keys are months in a l10able format
    // so we only keep the year and month part of the date
    const month = p.metadata.datetime.slice(0, 7) + '-01T00:00'
    /* istanbul ignore else */
    if (!months.hasOwnProperty(month)) {
      months[month] = []
    }
    months[month].push(p)
  })
  return Object.keys(months).map(month => {
    return {
      title: month,
      photos: months[month]
    }
  })
}
