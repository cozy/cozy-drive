const loadDeviceContacts = () => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        displayName: 'Joe Display Name',
        name: {
          familyName: "Bell",
          formatted: "Kate Bell",
          givenName: "Kate",
          honorificPrefix: null,
          honorificSuffix: null,
          middleName: null
        },
        organizations: [
          {pref: "false", title: "Producer", name: "Creative Consulting", department: null, type: null}
        ],
        phoneNumbers: [
          {value: "(555) 564-8583", pref: false, id: 0, type: "mobile"},
          {value: "(415) 555-3695", pref: false, id: 1, type: "main"}
        ],
        emails: [
          {value: "kate-bell@mac.com", pref: false, id: 0, type: "work"},
          {value: "www.icloud.com", pref: false, id: 1, type: "work"}
        ],
        addresses: [
          {pref: "false", locality: "Hillsborough", region: "CA", id: 0, postalCode: "94010"}
        ]
      }
    ])
  })
}

const getCozyContacts = async (ids = []) => {
  let response
  try {
    response = await cozy.client.fetchJSON('GET', '/data/io.cozy.contacts/_all_docs?include_docs=true', {keys: ids})
  }
  catch (exception) {
    console.warn(exception)
    return []
  }
  return response.rows.map(row => row.doc)
}

const createContact = contact => {
  return cozy.client.data.create('io.cozy.contacts', contact)
}

const cordovaContactToCozy = (contact) => {
  let cozyContact = {}

  cozyContact.fullname = contact.displayName
  cozyContact.name = {
    familyName: contact.name.familyName,
    givenName: contact.name.givenName,
    additionalName: contact.name.middleName,
    namePrefix: contact.name.honorificPrefix,
    nameSuffix: contact.name.honorificSuffix
  }

  cozyContact.email = []
  contact.emails.forEach(email => {
    cozyContact.email.push({
      address: email.value,
      type: email.type,
      label: null,
      primary: !!email.pref
    })
  })

  cozyContact.address = []
  contact.addresses.forEach(address => {
    cozyContact.address.push({
      street: address.streetAddress,
      pobox: null,
      city: address.locality,
      region: address.region,
      postcode: address.postalCode,
      country: address.country,
      type: address.type,
      primary: !!address.pref,
      formattedAddress: address.formatted
    })
  })

  cozyContact.phone = []
  contact.phoneNumbers.forEach(phone => {
    cozyContact.phone.push({
      number: phone.value,
      type: phone.type,
      label: null,
      primary: !!phone.pref,
    })
  })

  return cozyContact
}

export const backupContacts = async () => {
  let deviceContacts = await loadDeviceContacts()
  //keep only contacts with an email address
  deviceContacts = deviceContacts.filter(contact => contact.emails.length > 0).map(cordovaContactToCozy)

  let cozyContacts = await getCozyContacts()

  //we want to add contacts that aren't in the cozy yet, and we'll use the email as id
  for (const deviceContact of deviceContacts) {
    let contactAlreadySynced = false
    let deviceEmails = deviceContact.email.map(email => email.address)

    for (const cozyContact of cozyContacts) {
      if (cozyContact.email.filter(email => {
        return deviceEmails.indexOf(email.address) >= 0
      }).length > 0) {
        contactAlreadySynced = true
        break
      }
    }

    if (contactAlreadySynced) {
      console.log('skipping contact', deviceContact)
      continue
    }

    console.log('insert contact', deviceContact)
    createContact(deviceContact)
  }
}
