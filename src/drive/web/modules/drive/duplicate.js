import { CozyFile } from 'models'

/**
 * generateDuplicatedName - Return a correct name for a future duplicated file
 *
 * @param {IOCozyFile} file  File to duplicate
 * @param {function} t  Transiflex helper
 */
const generateDuplicatedName = (file, t) => {
  const { filename, extension } = CozyFile.splitFilename(file)
  const copyString = '(copie)' // TODO use t here
  if (filename.endsWith(copyString)) {
    return `${filename} (1)${extension}`
  }
  if (filename.includes('(copie)')) {
    const [originalName, index] = filename.split('(copie)')
    return `${originalName} (copie) (${index + 1})${extension}`
  }
  return `${filename} (copie)${extension}`
}

/**
 * duplicateFiles - Start duplicate files
 *
 * @param {CozyClient} client
 * @param {IOCozyFile} files    One or more files to duplicate
 * @param {function} t  Transiflex helper
 // * @param {WebVaultClient} object.vaultClient
 */
export const duplicateFiles = async (client, files, t) => {
  console.log(t)

  console.log('duplication start')
  for (const file of files) {
    console.log({ file })

    const reference = undefined

    const newName = generateDuplicatedName(file, t)
    const doc = {
      ...file,
      name: newName,
      attributes: { ...file.attributes, name: newName, created_at: undefined },
      relationships: undefined,
      created_at: undefined,
      id: undefined,
      _id: undefined
    }
    const response = await client.create(file._type, doc, reference)
    console.log({ response })

    const example = {
      file: {
        id: '580b0b59aa5f606f6352074ce80642eb',
        _id: '580b0b59aa5f606f6352074ce80642eb',
        _type: 'io.cozy.files',
        type: 'file',
        attributes: {
          type: 'file',
          name: 'Wallpaper.png',
          dir_id: '580b0b59aa5f606f6352074ce806422e',
          created_at: '2022-09-13T08:08:54.627Z',
          updated_at: '2022-09-13T08:08:54.627Z',
          size: '9884',
          md5sum: 'uRBP3QcB+vmwpBb+TC4gWw==',
          mime: 'image/png',
          class: 'image',
          executable: false,
          trashed: false,
          encrypted: false,
          metadata: {
            datetime: '2022-09-13T08:08:54.627Z',
            extractor_version: 2,
            height: 209,
            width: 167
          },
          cozyMetadata: {
            doctypeVersion: '1',
            metadataVersion: 1,
            createdAt: '2022-09-16T09:35:00.45417+02:00',
            createdByApp: 'drive',
            updatedAt: '2022-09-16T09:40:10.183317+02:00',
            updatedByApps: [
              {
                slug: 'drive',
                date: '2022-09-16T09:35:00.45417+02:00',
                instance: 'http://cozy.localhost:8080/'
              },
              {
                slug: 'photos',
                date: '2022-09-16T09:40:10.183317+02:00',
                instance: 'http://cozy.localhost:8080/'
              }
            ],
            createdOn: 'http://cozy.localhost:8080/',
            uploadedAt: '2022-09-16T09:35:00.45417+02:00',
            uploadedBy: {
              slug: 'drive'
            },
            uploadedOn: 'http://cozy.localhost:8080/'
          },
          path: '/Photos/Settings/Wallpaper.png'
        },
        meta: {
          rev: '2-8868526ec7e17d005d434493b1bade5d'
        },
        links: {
          self: '/files/580b0b59aa5f606f6352074ce80642eb',
          tiny: '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/tiny',
          small:
            '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/small',
          medium:
            '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/medium',
          large:
            '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/large'
        },
        relationships: {
          parent: {
            links: {
              related: '/files/580b0b59aa5f606f6352074ce806422e'
            },
            data: {
              id: '580b0b59aa5f606f6352074ce806422e',
              type: 'io.cozy.files'
            }
          },
          referenced_by: {
            links: {
              self: '/files/580b0b59aa5f606f6352074ce80642eb/relationships/references'
            },
            data: [
              {
                id: '580b0b59aa5f606f6352074ce806822f',
                type: 'io.cozy.photos.albums'
              }
            ]
          }
        },
        name: 'Wallpaper.png',
        dir_id: '580b0b59aa5f606f6352074ce806422e',
        created_at: '2022-09-13T08:08:54.627Z',
        updated_at: '2022-09-13T08:08:54.627Z',
        size: '9884',
        md5sum: 'uRBP3QcB+vmwpBb+TC4gWw==',
        mime: 'image/png',
        class: 'image',
        executable: false,
        trashed: false,
        encrypted: false,
        metadata: {
          datetime: '2022-09-13T08:08:54.627Z',
          extractor_version: 2,
          height: 209,
          width: 167
        },
        cozyMetadata: {
          doctypeVersion: '1',
          metadataVersion: 1,
          createdAt: '2022-09-16T09:35:00.45417+02:00',
          createdByApp: 'drive',
          updatedAt: '2022-09-16T09:40:10.183317+02:00',
          updatedByApps: [
            {
              slug: 'drive',
              date: '2022-09-16T09:35:00.45417+02:00',
              instance: 'http://cozy.localhost:8080/'
            },
            {
              slug: 'photos',
              date: '2022-09-16T09:40:10.183317+02:00',
              instance: 'http://cozy.localhost:8080/'
            }
          ],
          createdOn: 'http://cozy.localhost:8080/',
          uploadedAt: '2022-09-16T09:35:00.45417+02:00',
          uploadedBy: {
            slug: 'drive'
          },
          uploadedOn: 'http://cozy.localhost:8080/'
        },
        path: '/Photos/Settings/Wallpaper.png',
        _rev: '2-8868526ec7e17d005d434493b1bade5d',
        old_versions: {
          target: {
            id: '580b0b59aa5f606f6352074ce80642eb',
            _id: '580b0b59aa5f606f6352074ce80642eb',
            _type: 'io.cozy.files',
            type: 'file',
            attributes: {
              type: 'file',
              name: 'Wallpaper.png',
              dir_id: '580b0b59aa5f606f6352074ce806422e',
              created_at: '2022-09-13T08:08:54.627Z',
              updated_at: '2022-09-13T08:08:54.627Z',
              size: '9884',
              md5sum: 'uRBP3QcB+vmwpBb+TC4gWw==',
              mime: 'image/png',
              class: 'image',
              executable: false,
              trashed: false,
              encrypted: false,
              metadata: {
                datetime: '2022-09-13T08:08:54.627Z',
                extractor_version: 2,
                height: 209,
                width: 167
              },
              cozyMetadata: {
                doctypeVersion: '1',
                metadataVersion: 1,
                createdAt: '2022-09-16T09:35:00.45417+02:00',
                createdByApp: 'drive',
                updatedAt: '2022-09-16T09:40:10.183317+02:00',
                updatedByApps: [
                  {
                    slug: 'drive',
                    date: '2022-09-16T09:35:00.45417+02:00',
                    instance: 'http://cozy.localhost:8080/'
                  },
                  {
                    slug: 'photos',
                    date: '2022-09-16T09:40:10.183317+02:00',
                    instance: 'http://cozy.localhost:8080/'
                  }
                ],
                createdOn: 'http://cozy.localhost:8080/',
                uploadedAt: '2022-09-16T09:35:00.45417+02:00',
                uploadedBy: {
                  slug: 'drive'
                },
                uploadedOn: 'http://cozy.localhost:8080/'
              },
              path: '/Photos/Settings/Wallpaper.png'
            },
            meta: {
              rev: '2-8868526ec7e17d005d434493b1bade5d'
            },
            links: {
              self: '/files/580b0b59aa5f606f6352074ce80642eb',
              tiny: '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/tiny',
              small:
                '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/small',
              medium:
                '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/medium',
              large:
                '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/large'
            },
            relationships: {
              parent: {
                links: {
                  related: '/files/580b0b59aa5f606f6352074ce806422e'
                },
                data: {
                  id: '580b0b59aa5f606f6352074ce806422e',
                  type: 'io.cozy.files'
                }
              },
              referenced_by: {
                links: {
                  self: '/files/580b0b59aa5f606f6352074ce80642eb/relationships/references'
                },
                data: [
                  {
                    id: '580b0b59aa5f606f6352074ce806822f',
                    type: 'io.cozy.photos.albums'
                  }
                ]
              }
            },
            name: 'Wallpaper.png',
            dir_id: '580b0b59aa5f606f6352074ce806422e',
            created_at: '2022-09-13T08:08:54.627Z',
            updated_at: '2022-09-13T08:08:54.627Z',
            size: '9884',
            md5sum: 'uRBP3QcB+vmwpBb+TC4gWw==',
            mime: 'image/png',
            class: 'image',
            executable: false,
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-09-13T08:08:54.627Z',
              extractor_version: 2,
              height: 209,
              width: 167
            },
            cozyMetadata: {
              doctypeVersion: '1',
              metadataVersion: 1,
              createdAt: '2022-09-16T09:35:00.45417+02:00',
              createdByApp: 'drive',
              updatedAt: '2022-09-16T09:40:10.183317+02:00',
              updatedByApps: [
                {
                  slug: 'drive',
                  date: '2022-09-16T09:35:00.45417+02:00',
                  instance: 'http://cozy.localhost:8080/'
                },
                {
                  slug: 'photos',
                  date: '2022-09-16T09:40:10.183317+02:00',
                  instance: 'http://cozy.localhost:8080/'
                }
              ],
              createdOn: 'http://cozy.localhost:8080/',
              uploadedAt: '2022-09-16T09:35:00.45417+02:00',
              uploadedBy: {
                slug: 'drive'
              },
              uploadedOn: 'http://cozy.localhost:8080/'
            },
            path: '/Photos/Settings/Wallpaper.png',
            _rev: '2-8868526ec7e17d005d434493b1bade5d'
          },
          name: 'old_versions',
          doctype: 'io.cozy.files.versions'
        },
        encryption: {
          target: {
            id: '580b0b59aa5f606f6352074ce80642eb',
            _id: '580b0b59aa5f606f6352074ce80642eb',
            _type: 'io.cozy.files',
            type: 'file',
            attributes: {
              type: 'file',
              name: 'Wallpaper.png',
              dir_id: '580b0b59aa5f606f6352074ce806422e',
              created_at: '2022-09-13T08:08:54.627Z',
              updated_at: '2022-09-13T08:08:54.627Z',
              size: '9884',
              md5sum: 'uRBP3QcB+vmwpBb+TC4gWw==',
              mime: 'image/png',
              class: 'image',
              executable: false,
              trashed: false,
              encrypted: false,
              metadata: {
                datetime: '2022-09-13T08:08:54.627Z',
                extractor_version: 2,
                height: 209,
                width: 167
              },
              cozyMetadata: {
                doctypeVersion: '1',
                metadataVersion: 1,
                createdAt: '2022-09-16T09:35:00.45417+02:00',
                createdByApp: 'drive',
                updatedAt: '2022-09-16T09:40:10.183317+02:00',
                updatedByApps: [
                  {
                    slug: 'drive',
                    date: '2022-09-16T09:35:00.45417+02:00',
                    instance: 'http://cozy.localhost:8080/'
                  },
                  {
                    slug: 'photos',
                    date: '2022-09-16T09:40:10.183317+02:00',
                    instance: 'http://cozy.localhost:8080/'
                  }
                ],
                createdOn: 'http://cozy.localhost:8080/',
                uploadedAt: '2022-09-16T09:35:00.45417+02:00',
                uploadedBy: {
                  slug: 'drive'
                },
                uploadedOn: 'http://cozy.localhost:8080/'
              },
              path: '/Photos/Settings/Wallpaper.png'
            },
            meta: {
              rev: '2-8868526ec7e17d005d434493b1bade5d'
            },
            links: {
              self: '/files/580b0b59aa5f606f6352074ce80642eb',
              tiny: '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/tiny',
              small:
                '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/small',
              medium:
                '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/medium',
              large:
                '/files/580b0b59aa5f606f6352074ce80642eb/thumbnails/65f5e9359b2e2a11/large'
            },
            relationships: {
              parent: {
                links: {
                  related: '/files/580b0b59aa5f606f6352074ce806422e'
                },
                data: {
                  id: '580b0b59aa5f606f6352074ce806422e',
                  type: 'io.cozy.files'
                }
              },
              referenced_by: {
                links: {
                  self: '/files/580b0b59aa5f606f6352074ce80642eb/relationships/references'
                },
                data: [
                  {
                    id: '580b0b59aa5f606f6352074ce806822f',
                    type: 'io.cozy.photos.albums'
                  }
                ]
              }
            },
            name: 'Wallpaper.png',
            dir_id: '580b0b59aa5f606f6352074ce806422e',
            created_at: '2022-09-13T08:08:54.627Z',
            updated_at: '2022-09-13T08:08:54.627Z',
            size: '9884',
            md5sum: 'uRBP3QcB+vmwpBb+TC4gWw==',
            mime: 'image/png',
            class: 'image',
            executable: false,
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-09-13T08:08:54.627Z',
              extractor_version: 2,
              height: 209,
              width: 167
            },
            cozyMetadata: {
              doctypeVersion: '1',
              metadataVersion: 1,
              createdAt: '2022-09-16T09:35:00.45417+02:00',
              createdByApp: 'drive',
              updatedAt: '2022-09-16T09:40:10.183317+02:00',
              updatedByApps: [
                {
                  slug: 'drive',
                  date: '2022-09-16T09:35:00.45417+02:00',
                  instance: 'http://cozy.localhost:8080/'
                },
                {
                  slug: 'photos',
                  date: '2022-09-16T09:40:10.183317+02:00',
                  instance: 'http://cozy.localhost:8080/'
                }
              ],
              createdOn: 'http://cozy.localhost:8080/',
              uploadedAt: '2022-09-16T09:35:00.45417+02:00',
              uploadedBy: {
                slug: 'drive'
              },
              uploadedOn: 'http://cozy.localhost:8080/'
            },
            path: '/Photos/Settings/Wallpaper.png',
            _rev: '2-8868526ec7e17d005d434493b1bade5d'
          },
          name: 'encryption',
          doctype: 'io.cozy.files.encryption'
        },
        displayedPath: '/Photos/Settings'
      }
    }
  }
}
