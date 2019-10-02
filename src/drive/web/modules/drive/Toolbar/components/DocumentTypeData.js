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
    classification: 'identity_document',
    subClassification: 'residence_permit',
    label: 'residence_permit'
  },
  {
    id: '4',
    classification: 'identity_document',
    subClassification: 'family_record_book',
    label: 'family_record_book'
  },
  {
    id: '5',
    classification: 'certificate',
    subject: 'life',
    label: 'birth_certificate'
  },
  {
    id: '6',
    classification: 'diploma',
    subClassification: 'car',
    label: 'driver_license'
  },
  {
    id: '7',
    classification: 'contract',
    subject: 'weeding',
    label: 'weeding'
  },
  {
    id: '8',
    classification: 'contract',
    subject: 'pacs',
    label: 'pacs'
  },
  {
    id: '9',
    classification: 'contract',
    subject: 'divorce',
    label: 'divorce'
  },
  {
    id: '10',
    classification: 'certificate',
    subject: 'family',
    label: 'large_family_card'
  },
  {
    id: '11',
    classification: 'certificate',
    subject: 'family',
    label: 'caf'
  },
  {
    id: '12',
    classification: 'diploma',
    label: 'diploma'
  },
  {
    id: '13',
    classification: 'contract',
    categorie: 'work',
    label: 'work_contract'
  },
  {
    id: '14',
    classification: 'payslip',
    label: 'pay_sheet'
  },
  {
    id: '15',
    classification: 'payslip',
    label: 'unemployment_benefit'
  },
  {
    id: '16',
    classification: 'payslip',
    label: 'pension'
  },
  {
    id: '17',
    classification: 'payslip',
    label: 'other_revenue'
  },
  {
    id: '18',
    classification: 'office',
    categorie: 'study',
    label: 'gradebook'
  },
  {
    id: '19',
    classification: 'office',
    label: 'health_book'
  },
  {
    id: '20',
    classification: 'certificate',
    label: 'insurance_card'
  },
  {
    id: '21',
    classification: 'report',
    categorie: 'health',
    label: 'prescription'
  },
  {
    id: '22',
    classification: 'invoicing',
    categorie: 'health',
    label: 'health_invoice'
  },
  {
    id: '23',
    classification: 'certificate',
    subject: 'car',
    label: 'registration'
  },
  {
    id: '24',
    classification: 'certificate',
    subject: 'car',
    label: 'car_insurance'
  },
  {
    id: '25',
    classification: 'invoicing',
    categorie: 'car',
    label: 'mechanic_invoice'
  },
  {
    id: '26',
    classification: 'invoicing',
    categorie: 'car',
    label: 'transport_invoice'
  },
  {
    id: '27',
    classification: 'invoicing',
    categorie: 'phone',
    label: 'phone_invoice'
  },
  {
    id: '28',
    classification: 'invoicing',
    categorie: 'isp',
    label: 'isp_invoice'
  },
  {
    id: '29',
    classification: 'invoicing',
    categorie: 'energy',
    label: 'energy_invoice'
  },
  {
    id: '30',
    classification: 'invoicing',
    categorie: 'web',
    label: 'web_service_invoice'
  },
  {
    id: '31',
    classification: 'contract',
    subject: 'house',
    label: 'lease'
  },
  {
    id: '32',
    classification: 'contract',
    subject: 'home',
    label: 'rent_receipt'
  },
  {
    id: '33',
    classification: 'contract',
    subject: 'house',
    label: 'house_insurance'
  }
]
export const categories = [
  {
    id: 'cat1',
    label: 'identity',
    icon: 'people',
    file_type_ids: ['1', '2', '3', '4', '5', '6']
  },
  {
    id: 'cat2',
    label: 'family',
    icon: 'team',
    file_type_ids: ['4', '5', '7', '8', '9', '10', '11']
  },
  {
    id: 'cat3',
    label: 'work_study',
    icon: 'company',
    file_type_ids: ['12', '13', '14', '15', '16', '17', '18']
  },
  {
    id: 'cat4',
    label: 'health',
    icon: 'heart',
    file_type_ids: ['19', '20', '21', '22']
  },
  {
    id: 'cat5',
    label: 'home',
    icon: 'home',
    file_type_ids: ['31', '32', '33', '27', '28', '29']
  },
  {
    id: 'cat6',
    label: 'transport',
    icon: 'car',
    file_type_ids: ['6', '23', '24', '25', '26']
  },
  {
    id: 'cat8',
    label: 'invoice',
    icon: 'euro',
    file_type_ids: ['27', '28', '29', '26', '30']
  } /* ,
  {
    id: 'cat9',
    label: 'others',
    icon: 'dots',
    file_type_ids: []
  } */
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
  return items.find(item => item.id === id)
}
