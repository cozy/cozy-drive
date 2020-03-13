export const SORTABLE_ATTRIBUTES = [
  { label: 'name', attr: 'name', css: 'file', defaultOrder: 'asc' },
  { label: 'update', attr: 'updated_at', css: 'date', defaultOrder: 'desc' }
  // TODO: activate sorting by size when it's ready on the back side
  // { label: 'size', attr: 'size', css: 'size', defaultOrder: 'desc' }
]
export const DEFAULT_SORT = { attribute: 'name', order: 'asc' }
