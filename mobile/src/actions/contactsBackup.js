import { isCordova } from '../lib/device'
import { setBackupContacts } from './settings'

const DOCTYPE_CONTACTS = 'io.cozy.contacts'

export const requestAuthorization = () => {
  return new Promise((resolve, reject) => {
    if (!isCordova() ||
       !navigator.contacts) {
      resolve(false)
    }
    else {
      // to trigger the permission, we need to interact with the contacts API — we're going to do a fake-find
      navigator.contacts.find(
        ['displayName'],
        () => {resolve(true)},
        (err) => {resolve(false)},
        {
          filter: (new Date()).toString(), // we just want a filter that won't match anything
          multiple: false
        }
      )
    }
  })
}

const loadDeviceContacts = () => {
  return new Promise((resolve, reject) => {
    navigator.contacts.find(['*'], resolve, reject)
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

const cordovaContactToCozy = (contact) => {
  let cozyContact = {}

  cozyContact.fullname = contact.displayName

  if (contact.name) {
    cozyContact.name = {
      familyName: contact.name.familyName,
      givenName: contact.name.givenName,
      additionalName: contact.name.middleName,
      namePrefix: contact.name.honorificPrefix,
      nameSuffix: contact.name.honorificSuffix
    }
  }

  cozyContact.email = []
  if (contact.emails) {
    contact.emails.forEach(email => {
      cozyContact.email.push({
        address: email.value,
        type: email.type,
        label: null,
        primary: !!email.pref
      })
    })
  }

  cozyContact.address = []
  if (contact.addresses) {
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
  }

  cozyContact.phone = []
  if (contact.phoneNumbers) {
    contact.phoneNumbers.forEach(phone => {
      cozyContact.phone.push({
        number: phone.value,
        type: phone.type,
        label: null,
        primary: !!phone.pref,
      })
    })
  }

  return cozyContact
}

export const backupContacts = () => async (dispatch) => {
  let deviceContacts

  try {
    deviceContacts = await loadDeviceContacts()
  }
  catch (e) {
    // the authorization has been revoked
    dispatch(setBackupContacts(false))
    return
  }
  //keep only contacts with an email address
  deviceContacts = deviceContacts.filter(contact => (contact.emails && contact.emails.length > 0)).map(cordovaContactToCozy)

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
      continue
    }

    cozy.client.data.create(DOCTYPE_CONTACTS, deviceContact)
  }
}
