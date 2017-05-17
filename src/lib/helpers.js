export const getPhotosByMonth = photos => {
  let sections = {}
  photos.forEach(p => {
    // here we want to get an object whose keys are months in a l10able format
    // so we only keep the year and month part of the date
    const month = p.metadata.datetime.slice(0, 7) + '-01T00:00'
    /* istanbul ignore else */
    if (!sections.hasOwnProperty(month)) {
      sections[month] = []
    }
    sections[month].push(p)
  })
  // we need to sort the months here because when new photos are uploaded, they
  // are inserted on top of the list, and months can become unordered
  const sortedMonths = Object.keys(sections).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  ).reverse()
  
  return sortedMonths.map(month => {
    return {
      title: month,
      photos: sections[month]
    }
  })
}
