const items = [
  {
    id: '1',
    classification: 'identity_document',
    subClassification: 'national_id_card',
    label: 'national_id_card'
  },
  {
    id: '2',
    classification: 'identity_document',
    subClassification: 'passport',
    label: 'passport'
  },
  {
    id: '3',
    label: 'weeding',
    classification: 'contract',
    categories: ['family'],
    subjects: ['weeding']
  },
  {
    id: '4',
    label: 'home insurance',
    classification: 'contract'
  },
  {
    id: '5',
    label: 'lease',
    classification: 'contract'
  }
]
export const categories = [
  {
    id: 'cat1',
    label: 'identity',
    icon: '',
    file_type_ids: [1, 2]
  },
  {
    id: 'cat2',
    label: 'home',
    file_type_ids: [3, 4]
  }
]

export const getItemsByCategory = ({ label }) => {
  const items = []
  categories.map(category => {
    if (category.label === label) {
      category.file_type_ids.map(itemId => {
        items.push(getItemById(itemId))
      })
    }
  })
  return items
}

export const getItemById = id => {
  let itemToReturn = ''
  items.map(item => {
    if (item.id == id) itemToReturn = item
  })
  return itemToReturn
}
