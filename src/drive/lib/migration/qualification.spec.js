import {
  extractFilesToMigrate,
  getFileRequalification,
  getMostRecentUpdatedDate,
  removeOldQualificationAttributes
} from 'drive/lib/migration/qualification'
import log from 'cozy-logger'

jest.mock('cozy-logger', () => jest.fn())

describe('qualification migration', () => {
  it('should extract files to migrate based on qualification attributes', () => {
    const fileNoQualif = {
      metadata: {
        datetime: '2020-01-01'
      }
    }
    const fileFullQualif = {
      metadata: {
        id: '1',
        label: 'dummy',
        classification: 'dummy',
        subClassification: 'dummy',
        categorie: 'dummy',
        category: 'dummy',
        categories: ['dummies'],
        subject: 'dummy',
        subjects: ['dummy']
      }
    }
    const files = [fileNoQualif, fileFullQualif]

    const filesToMigrate = extractFilesToMigrate(files)
    expect(filesToMigrate).toHaveLength(1)
    expect(filesToMigrate[0]).toEqual(fileFullQualif)
  })

  it('should not extract files with id but not label attributes', () => {
    const file = {
      metadata: {
        id: '1',
        qualification: {}
      }
    }
    expect(extractFilesToMigrate([file])).toHaveLength(0)
  })

  it('should get the new qualification for a file qualified by cozy-scanner', () => {
    const file = {
      metadata: {
        id: '22',
        classification: 'invoicing',
        categorie: 'health',
        label: 'health_invoice'
      }
    }
    const qualif = getFileRequalification(file)
    expect(qualif).toEqual({
      label: 'health_invoice',
      purpose: 'invoice',
      sourceCategory: 'health'
    })
  })

  it('should get the new qualification for a registration file qualified by cozy-scanner', () => {
    const file = {
      metadata: {
        label: 'registration'
      }
    }
    const qualif = getFileRequalification(file)
    expect(qualif).toEqual({
      label: 'vehicle_registration',
      purpose: 'attestation',
      sourceCategory: 'gov',
      sourceSubCategory: 'transport',
      subjects: ['right', 'identity']
    })
  })

  it('should get the new qualification for a insurance_card file qualified by cozy-scanner', () => {
    const file = {
      metadata: {
        label: 'insurance_card'
      }
    }
    const qualif = getFileRequalification(file)
    expect(qualif).toEqual({
      label: 'national_health_insurance_card',
      purpose: 'attestation',
      sourceCategory: 'gov',
      sourceSubCategory: 'health',
      subjects: ['identity', 'insurance']
    })
  })

  it('should get the new qualification for a file qualified by a konnector', () => {
    const file = {
      metadata: {
        contentAuthor: 'ameli',
        classification: 'invoicing',
        categorie: 'health',
        label: 'health_invoice'
      }
    }
    const qualif = getFileRequalification(file)
    expect(qualif).toEqual({
      label: 'health_invoice',
      purpose: 'invoice',
      sourceCategory: 'health'
    })
  })

  it('should log an error null when no qualification is possible', () => {
    const file = {
      metadata: {
        label: 'fake_label'
      }
    }
    expect(getFileRequalification(file)).toBeNull()
    expect(log).toHaveBeenCalledWith('error', expect.anything())
  })

  it('should remove old qualification attributes', () => {
    const file = {
      metadata: {
        id: 1,
        label: 'label',
        classification: 'classification',
        subClassification: 'subClassification',
        categorie: 'categorie',
        category: 'category',
        categories: 'categories',
        subject: 'subject',
        subjects: 'subjects',
        datetime: '2020-10-10'
      }
    }
    expect(removeOldQualificationAttributes(file)).toEqual({
      metadata: {
        id: 1,
        datetime: '2020-10-10'
      }
    })

    file.metadata = {}
    expect(removeOldQualificationAttributes(file)).toEqual(file)
  })

  it('should find the most recent date in a list of files', () => {
    let files = []
    expect(getMostRecentUpdatedDate(files)).toBeNull()

    files = [{}, {}]
    expect(getMostRecentUpdatedDate(files)).toBeNull()

    files = [
      {},
      {
        _id: '456',
        data: {
          attributes: {
            cozyMetadata: {
              updatedAt: '2020-01-01'
            }
          }
        }
      }
    ]
    expect(getMostRecentUpdatedDate(files)).toEqual('2020-01-01')

    files = [
      {},
      {},
      {
        _id: '123',
        data: {
          attributes: {
            cozyMetadata: {
              updatedAt: '2020-01-01'
            }
          }
        }
      }
    ]
    expect(getMostRecentUpdatedDate(files)).toEqual('2020-01-01')

    files = [
      {
        _id: '123',
        data: {
          attributes: {
            cozyMetadata: {
              updatedAt: '2020-01-02'
            }
          }
        }
      },
      {},
      {},
      {
        _id: '456',
        data: {
          attributes: {
            cozyMetadata: {
              updatedAt: '2020-01-01'
            }
          }
        }
      }
    ]
    expect(getMostRecentUpdatedDate(files)).toEqual('2020-01-02')
  })
})
