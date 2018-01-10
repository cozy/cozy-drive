export const FAKE_FOLDER = {
  _id: '02fc14dc3c447824dc32d9198300f57d',
  _type: 'io.cozy.files'
}

export const KNOWN_CONTACT = {
  id: '02fc14dc3c447824dc32d91983010c2d',
  type: 'io.cozy.contacts',
  attributes: {
    name: {},
    email: [{ address: 'jane@doe.com', primary: true }]
  }
}

export const SHARING_1 = {
  type: 'io.cozy.sharings',
  id: '02fc14dc3c447824dc32d9198301170b',
  attributes: {
    sharing_type: 'two-way',
    owner: true,
    description: 'Test',
    app_slug: 'drive',
    created_at: '2018-01-08T09:03:33.777003842+01:00',
    updated_at: '2018-01-08T09:03:33.777003842+01:00'
  },
  meta: { rev: '1-c9913518ec98ab980e3ffab07da26b86' },
  links: { self: '/sharings/02fc14dc3c447824dc32d9198301170b' },
  relationships: {
    permissions: {
      links: { self: '/permissions/02fc14dc3c447824dc32d91983011fa2' },
      data: {
        id: '02fc14dc3c447824dc32d91983011fa2',
        type: 'shared-by-me'
      }
    },
    recipients: {
      data: [
        {
          id: KNOWN_CONTACT.id,
          type: 'io.cozy.contacts',
          status: 'pending'
        }
      ]
    }
  }
}

export const APPS_RESPONSE = {
  data: [
    {
      _type: 'io.cozy.apps',
      _id: 'io.cozy.apps/drive',
      attributes: {
        name: 'Drive',
        editor: 'Cozy',
        slug: 'drive',
        state: 'ready'
      },
      meta: { rev: '1-9dfe2ff6a4ef9df38d1ea2c36964aec6' },
      links: {
        self: '/apps/drive',
        related: 'http://drive.cozy.tools:8080/',
        icon: '/apps/drive/icon'
      }
    },
    {
      _type: 'io.cozy.apps',
      _id: 'io.cozy.apps/photos',
      attributes: {
        name: 'Photos',
        editor: 'Cozy',
        slug: 'photos',
        state: 'ready'
      },
      meta: { rev: '1-c1221d1b45fa592ea7fa25922733b260' },
      links: {
        self: '/apps/photos',
        related: 'http://photos.cozy.tools:8080/',
        icon: '/apps/photos/icon'
      }
    }
  ]
}

export const CREATE_SHARING_RESPONSE = {
  data: SHARING_1,
  included: [
    {
      type: 'io.cozy.permissions',
      id: '02fc14dc3c447824dc32d91983011fa2',
      attributes: {
        type: 'shared-by-me',
        source_id: 'io.cozy.sharings/02fc14dc3c447824dc32d9198301170b',
        permissions: {
          files: {
            type: 'io.cozy.files',
            values: ['02fc14dc3c447824dc32d9198300f57d']
          }
        },
        codes: {
          [KNOWN_CONTACT.id]:
            'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzaGFyZSIsImlhdCI6MTUxNTM5ODYxMywiaXNzIjoiY296eS50b29sczo4MDgwIiwic3ViIjoiMDJmYzE0ZGMzYzQ0NzgyNGRjMzJkOTE5ODMwMTBjMmQifQ.dfJw68rgvQZ0NfCGWUZ4hB1d44kaWbIpM5GpY0KclA1cZjWSUopArLYNC1XpNhpA4XjFy0GL55Ab0vkEVNqazA'
        }
      },
      meta: { rev: '1-f490eb611a9a4ee0a7d92bf5e8c5f933' },
      links: {
        self: '/permissions/02fc14dc3c447824dc32d91983011fa2',
        related: '/sharings/02fc14dc3c447824dc32d9198301170b'
      }
    },
    {
      ...KNOWN_CONTACT,
      meta: { rev: '1-931869e3b25095bbeb1ba09b982b00b8' },
      links: {
        self: `/data/io.cozy.contacts/${KNOWN_CONTACT.id}`
      }
    }
  ]
}

export const CREATE_SHARED_LINK_RESPONSE = {
  data: {
    type: 'io.cozy.permissions',
    id: '02fc14dc3c447824dc32d91983013761',
    attributes: {
      type: 'share',
      source_id: 'io.cozy.apps/drive',
      permissions: {
        files: {
          type: 'io.cozy.files',
          verbs: ['GET'],
          values: ['02fc14dc3c447824dc32d9198300f57d']
        }
      },
      codes: {
        email:
          'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzaGFyZSIsImlhdCI6MTUxNTU4ODk2OSwiaXNzIjoiY296eS50b29sczo4MDgwIiwic3ViIjoiZW1haWwifQ.s4jZoFKym2grmEaO4YlCxzznr9dqiU7IIvgx5cds2oBrM_Cvg0rO1kShqvM3m9CjNSMd-OrlqPfdRVd7_hFy8g'
      }
    },
    meta: { rev: '1-f98188c09fcce6f3bc4ff998476d3962' },
    links: { self: '/permissions/02fc14dc3c447824dc32d91983013761' }
  }
}
