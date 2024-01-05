export const extractFileAttributes = f => {
  const id = f.id || f._id
  return {
    ...f.attributes,
    id,
    _id: id,
    _type: 'io.cozy.files',
    links: f.links,
    relationships: f.relationships
  }
}
