export const folder = {
  id: 'cc0a6981d593205dcefe29dcb2021b80',
  _id: 'cc0a6981d593205dcefe29dcb2021b80',
  _type: 'io.cozy.files',
  type: 'directory',
  attributes: {
    type: 'directory',
    name: 'Folder Name',
    dir_id: 'io.cozy.files.root-dir',
    created_at: '2020-11-03T12:31:43.027718+01:00',
    updated_at: '2020-11-03T12:31:43.027718+01:00',
    tags: [],
    path: '/Folder Name',
    cozyMetadata: {
      doctypeVersion: '1',
      metadataVersion: 1,
      createdAt: '2020-11-03T12:31:43.028779+01:00',
      createdByApp: 'drive',
      updatedAt: '2020-11-03T12:31:43.028779+01:00',
      updatedByApps: [
        {
          slug: 'drive',
          date: '2020-11-03T12:31:43.028779+01:00',
          instance: 'http://cozy.tools:8080/'
        }
      ],
      createdOn: 'http://cozy.tools:8080/'
    }
  },
  meta: {
    rev: '1-99e787c29e88dc5a8a2a7aafc4f682ed'
  },
  links: {
    self: '/files/cc0a6981d593205dcefe29dcb2021b80'
  },
  name: 'Folder Name',
  dir_id: 'io.cozy.files.root-dir',
  created_at: '2020-11-03T12:31:43.027718+01:00',
  updated_at: '2020-11-03T12:31:43.027718+01:00',
  tags: [],
  path: '/Folder Name',
  cozyMetadata: {
    doctypeVersion: '1',
    metadataVersion: 1,
    createdAt: '2020-11-03T12:31:43.028779+01:00',
    createdByApp: 'drive',
    updatedAt: '2020-11-03T12:31:43.028779+01:00',
    updatedByApps: [
      {
        slug: 'drive',
        date: '2020-11-03T12:31:43.028779+01:00',
        instance: 'http://cozy.tools:8080/'
      }
    ],
    createdOn: 'http://cozy.tools:8080/'
  },
  old_versions: {
    target: {
      id: 'cc0a6981d593205dcefe29dcb2021b80',
      _id: 'cc0a6981d593205dcefe29dcb2021b80',
      _type: 'io.cozy.files',
      type: 'directory',
      attributes: {
        type: 'directory',
        name: 'Folder Name',
        dir_id: 'io.cozy.files.root-dir',
        created_at: '2020-11-03T12:31:43.027718+01:00',
        updated_at: '2020-11-03T12:31:43.027718+01:00',
        tags: [],
        path: '/Folder Name',
        cozyMetadata: {
          doctypeVersion: '1',
          metadataVersion: 1,
          createdAt: '2020-11-03T12:31:43.028779+01:00',
          createdByApp: 'drive',
          updatedAt: '2020-11-03T12:31:43.028779+01:00',
          updatedByApps: [
            {
              slug: 'drive',
              date: '2020-11-03T12:31:43.028779+01:00',
              instance: 'http://cozy.tools:8080/'
            }
          ],
          createdOn: 'http://cozy.tools:8080/'
        }
      },
      meta: {
        rev: '1-99e787c29e88dc5a8a2a7aafc4f682ed'
      },
      links: {
        self: '/files/cc0a6981d593205dcefe29dcb2021b80'
      },
      name: 'Folder Name',
      dir_id: 'io.cozy.files.root-dir',
      created_at: '2020-11-03T12:31:43.027718+01:00',
      updated_at: '2020-11-03T12:31:43.027718+01:00',
      tags: [],
      path: '/Folder Name',
      cozyMetadata: {
        doctypeVersion: '1',
        metadataVersion: 1,
        createdAt: '2020-11-03T12:31:43.028779+01:00',
        createdByApp: 'drive',
        updatedAt: '2020-11-03T12:31:43.028779+01:00',
        updatedByApps: [
          {
            slug: 'drive',
            date: '2020-11-03T12:31:43.028779+01:00',
            instance: 'http://cozy.tools:8080/'
          }
        ],
        createdOn: 'http://cozy.tools:8080/'
      }
    },
    name: 'old_versions',
    doctype: 'io.cozy.files.versions'
  }
}

export const actionsMenu = [
  {
    item: {
      icon: 'item',
      Component: jest.fn().mockReturnValue('ActionsMenuItem'),
      action: jest.fn()
    }
  }
]

export const officeDocParam = {
  data: {
    type: 'io.cozy.office.url',
    id: '32e07d806f9b0139c541543d7eb8149c',
    class: 'text',
    name: 'Letter.docx',
    attributes: {
      document_id: '32e07d806f9b0139c541543d7eb8149c',
      subdomain: 'flat',
      protocol: 'https',
      instance: 'bob.cozy.example',
      public_name: 'Bob',
      onlyoffice: {
        url: 'https://documentserver/',
        documentType: 'word',
        document: {
          filetype: 'docx',
          key: '32e07d806f9b0139c541543d7eb8149c-56a653128a91a5c2291db9735b43fd86',
          title: 'Letter.docx',
          url: 'https://bob.cozy.example/files/downloads/735e6cf69af2db82/Letter.docx?Dl=1',
          info: {
            owner: 'Bob',
            uploaded: '2010-07-07 3:46 PM'
          }
        },
        editor: {
          callbackUrl:
            'https://bob.cozy.example/office/32e07d806f9b0139c541543d7eb8149c/callback',
          lang: 'en',
          mode: 'edit'
        }
      }
    }
  }
}
