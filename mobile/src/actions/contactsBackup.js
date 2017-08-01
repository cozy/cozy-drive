/* global cozy */
import { isCordova } from '../lib/device'
import { setBackupContacts, registerDevice } from './settings'
import { logException } from '../lib/reporter'

const DOCTYPE_CONTACTS = 'io.cozy.contacts'

export const requestDeviceAuthorization = () => {
  return new Promise((resolve, reject) => {
    if (!isCordova() ||
       !navigator.contacts) {
      resolve(false)
    } else {
      // to trigger the permission, we need to interact with the contacts API — we're going to do a fake-find
      navigator.contacts.find(
        ['displayName'],
        () => { resolve(true) },
        (e) => {
          logException(e)
          resolve(false)
        },
        {
          filter: (new Date()).toString(), // we just want a filter that won't match anything
          multiple: false
        }
      )
    }
  })
}

// versions 0.3.5 of the app and prior only requested permissions for io.cozy.files ; this function makes checks if we have permissions for io.cozy.contact and requests them if not
export const requestCozyAuthorization = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tokenScope = getState().mobile.settings.tokenScope || ''
      if (tokenScope.indexOf(DOCTYPE_CONTACTS) >= 0) {
        resolve(true)
      } else {
        await dispatch(registerDevice())
        resolve(true)
      }
    } catch (e) {
      logException(e)
      resolve(false)
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
  } catch (e) {
    // exceptions might happen if the database is not created yet, which is ok
    return []
  }
  return response.rows.map(row => row.doc)
}

const cordovaContactToCozy = (contact) => {
  let cozyContact = {}
  let baseContact = {
    displayName: '',
    name: {},
    emails: [],
    addresses: [],
    phoneNumbers: [],
    ...contact
  }

  cozyContact.fullname = baseContact.displayName

  cozyContact.name = {
    familyName: baseContact.name.familyName,
    givenName: baseContact.name.givenName,
    additionalName: baseContact.name.middleName,
    namePrefix: baseContact.name.honorificPrefix,
    nameSuffix: baseContact.name.honorificSuffix
  }

  cozyContact.email = []
  baseContact.emails.forEach(email => {
    cozyContact.email.push({
      address: email.value,
      type: email.type,
      label: null,
      primary: !!email.pref
    })
  })

  cozyContact.address = []
  baseContact.addresses.forEach(address => {
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
  baseContact.phoneNumbers.forEach(phone => {
    cozyContact.phone.push({
      number: phone.value,
      type: phone.type,
      label: null,
      primary: !!phone.pref
    })
  })

  return cozyContact
}

const filterContactsWithEmailAddress = contacts => {
  return contacts.filter(contact => (contact.emails && contact.emails.length > 0))
}

export const backupContacts = () => async (dispatch) => {
  let deviceContacts

  try {
    deviceContacts = await loadDeviceContacts()
  } catch (e) {
    // the authorization has been revoked
    dispatch(setBackupContacts(false))
    return
  }

  deviceContacts = filterContactsWithEmailAddress(deviceContacts).map(cordovaContactToCozy)

  let cozyContacts = await getCozyContacts()

  // we want to add contacts that aren't in the cozy yet, and we'll use the email as id
  for (const deviceContact of deviceContacts) {
    let contactAlreadySynced = false
    let deviceContactEmails = deviceContact.email.map(email => email.address)

    for (const cozyContact of cozyContacts) {
      if (cozyContact.email instanceof Array === false) continue

      if (cozyContact.email.filter(email => (email.address && deviceContactEmails.indexOf(email.address) >= 0)).length > 0) {
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
