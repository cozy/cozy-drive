import flag from 'cozy-flags'

export const isOnlyOfficeEnabled = () => flag('drive.onlyoffice.enabled')

export const makeOnlyOfficeFileRoute = (file, isWithRouter) =>
  isWithRouter ? `/onlyoffice/${file.id}` : `/#/onlyoffice/${file.id}`
