import React, { useMemo } from 'react'

import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
import SharingButton from 'cozy-ui/transpiled/react/Viewer/Footer/Sharing'
import { useNavigate, useParams } from 'react-router-dom'
import { isQueryLoading, useQuery, useQueryAll } from 'cozy-client'
import { buildTimelineQuery } from '../queries/queries'

const PhotosViewer = () => {
  /* const photos = [
    {
      id: 'e66cd2db6ab3c9f3be2aa0eb530384e1',
      _id: 'e66cd2db6ab3c9f3be2aa0eb530384e1',
      _type: 'io.cozy.files',
      type: 'file',
      attributes: {
        type: 'file',
        name: 'anita-austvika-5-LfxumAmkc-unsplash.jpg',
        dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
        size: '7699561',
        class: 'image',
        trashed: false,
        encrypted: false,
        metadata: {
          datetime: '2022-12-02T15:58:01.117Z',
          extractor_version: 2,
          height: 7360,
          width: 4912
        },
        updated_at: '2022-12-02T15:58:01.117Z'
      },
      meta: {
        rev: '3-c77a8865262fa3110b2f1e7cb63631b4'
      },
      links: {
        self: '/files/e66cd2db6ab3c9f3be2aa0eb530384e1',
        tiny: '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/thumbnails/bc395ab244abe9e0/tiny',
        small:
          '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/thumbnails/bc395ab244abe9e0/small',
        medium:
          '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/thumbnails/bc395ab244abe9e0/medium',
        large:
          '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/thumbnails/bc395ab244abe9e0/large'
      },
      relationships: {
        parent: {
          links: {
            related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
          },
          data: {
            id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            type: 'io.cozy.files'
          }
        },
        referenced_by: {
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/relationships/references'
          },
          data: null
        }
      },
      name: 'anita-austvika-5-LfxumAmkc-unsplash.jpg',
      dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
      size: '7699561',
      class: 'image',
      trashed: false,
      encrypted: false,
      metadata: {
        datetime: '2022-12-02T15:58:01.117Z',
        extractor_version: 2,
        height: 7360,
        width: 4912
      },
      updated_at: '2022-12-02T15:58:01.117Z',
      _rev: '3-c77a8865262fa3110b2f1e7cb63631b4',
      albums: {
        target: {
          id: 'e66cd2db6ab3c9f3be2aa0eb530384e1',
          _id: 'e66cd2db6ab3c9f3be2aa0eb530384e1',
          _type: 'io.cozy.files',
          type: 'file',
          attributes: {
            type: 'file',
            name: 'anita-austvika-5-LfxumAmkc-unsplash.jpg',
            dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            size: '7699561',
            class: 'image',
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-12-02T15:58:01.117Z',
              extractor_version: 2,
              height: 7360,
              width: 4912
            },
            updated_at: '2022-12-02T15:58:01.117Z'
          },
          meta: {
            rev: '3-c77a8865262fa3110b2f1e7cb63631b4'
          },
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb530384e1',
            tiny: '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/thumbnails/bc395ab244abe9e0/tiny',
            small:
              '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/thumbnails/bc395ab244abe9e0/small',
            medium:
              '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/thumbnails/bc395ab244abe9e0/medium',
            large:
              '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/thumbnails/bc395ab244abe9e0/large'
          },
          relationships: {
            parent: {
              links: {
                related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
              },
              data: {
                id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
                type: 'io.cozy.files'
              }
            },
            referenced_by: {
              links: {
                self: '/files/e66cd2db6ab3c9f3be2aa0eb530384e1/relationships/references'
              },
              data: null
            }
          },
          name: 'anita-austvika-5-LfxumAmkc-unsplash.jpg',
          dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
          size: '7699561',
          class: 'image',
          trashed: false,
          encrypted: false,
          metadata: {
            datetime: '2022-12-02T15:58:01.117Z',
            extractor_version: 2,
            height: 7360,
            width: 4912
          },
          updated_at: '2022-12-02T15:58:01.117Z',
          _rev: '3-c77a8865262fa3110b2f1e7cb63631b4'
        },
        name: 'albums',
        doctype: 'io.cozy.photos.albums'
      }
    },
    {
      id: 'e66cd2db6ab3c9f3be2aa0eb5303d847',
      _id: 'e66cd2db6ab3c9f3be2aa0eb5303d847',
      _type: 'io.cozy.files',
      type: 'file',
      attributes: {
        type: 'file',
        name: 'max-kukurudziak-n4dV0ZtwD7M-unsplash.jpg',
        dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
        size: '2954676',
        class: 'image',
        trashed: false,
        encrypted: false,
        metadata: {
          datetime: '2022-12-02T15:57:48.8Z',
          extractor_version: 2,
          height: 4034,
          width: 6051
        },
        updated_at: '2022-12-02T15:57:48.8Z'
      },
      meta: {
        rev: '3-443ff7ad6d975f94627c67550b43d71f'
      },
      links: {
        self: '/files/e66cd2db6ab3c9f3be2aa0eb5303d847',
        tiny: '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/thumbnails/9e348a4938c55c4f/tiny',
        small:
          '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/thumbnails/9e348a4938c55c4f/small',
        medium:
          '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/thumbnails/9e348a4938c55c4f/medium',
        large:
          '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/thumbnails/9e348a4938c55c4f/large'
      },
      relationships: {
        parent: {
          links: {
            related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
          },
          data: {
            id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            type: 'io.cozy.files'
          }
        },
        referenced_by: {
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/relationships/references'
          },
          data: null
        }
      },
      name: 'max-kukurudziak-n4dV0ZtwD7M-unsplash.jpg',
      dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
      size: '2954676',
      class: 'image',
      trashed: false,
      encrypted: false,
      metadata: {
        datetime: '2022-12-02T15:57:48.8Z',
        extractor_version: 2,
        height: 4034,
        width: 6051
      },
      updated_at: '2022-12-02T15:57:48.8Z',
      _rev: '3-443ff7ad6d975f94627c67550b43d71f',
      albums: {
        target: {
          id: 'e66cd2db6ab3c9f3be2aa0eb5303d847',
          _id: 'e66cd2db6ab3c9f3be2aa0eb5303d847',
          _type: 'io.cozy.files',
          type: 'file',
          attributes: {
            type: 'file',
            name: 'max-kukurudziak-n4dV0ZtwD7M-unsplash.jpg',
            dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            size: '2954676',
            class: 'image',
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-12-02T15:57:48.8Z',
              extractor_version: 2,
              height: 4034,
              width: 6051
            },
            updated_at: '2022-12-02T15:57:48.8Z'
          },
          meta: {
            rev: '3-443ff7ad6d975f94627c67550b43d71f'
          },
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb5303d847',
            tiny: '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/thumbnails/9e348a4938c55c4f/tiny',
            small:
              '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/thumbnails/9e348a4938c55c4f/small',
            medium:
              '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/thumbnails/9e348a4938c55c4f/medium',
            large:
              '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/thumbnails/9e348a4938c55c4f/large'
          },
          relationships: {
            parent: {
              links: {
                related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
              },
              data: {
                id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
                type: 'io.cozy.files'
              }
            },
            referenced_by: {
              links: {
                self: '/files/e66cd2db6ab3c9f3be2aa0eb5303d847/relationships/references'
              },
              data: null
            }
          },
          name: 'max-kukurudziak-n4dV0ZtwD7M-unsplash.jpg',
          dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
          size: '2954676',
          class: 'image',
          trashed: false,
          encrypted: false,
          metadata: {
            datetime: '2022-12-02T15:57:48.8Z',
            extractor_version: 2,
            height: 4034,
            width: 6051
          },
          updated_at: '2022-12-02T15:57:48.8Z',
          _rev: '3-443ff7ad6d975f94627c67550b43d71f'
        },
        name: 'albums',
        doctype: 'io.cozy.photos.albums'
      }
    },
    {
      id: 'e66cd2db6ab3c9f3be2aa0eb530349d0',
      _id: 'e66cd2db6ab3c9f3be2aa0eb530349d0',
      _type: 'io.cozy.files',
      type: 'file',
      attributes: {
        type: 'file',
        name: 'alina-perekatenkova-Im1SH4jRfO4-unsplash.jpg',
        dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
        size: '2690300',
        class: 'image',
        trashed: false,
        encrypted: false,
        metadata: {
          datetime: '2022-12-02T15:57:41.63Z',
          extractor_version: 2,
          height: 5478,
          width: 3652
        },
        updated_at: '2022-12-02T15:57:41.63Z'
      },
      meta: {
        rev: '3-2692d5fe98f3aaa1b276530e5b16e304'
      },
      links: {
        self: '/files/e66cd2db6ab3c9f3be2aa0eb530349d0',
        tiny: '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/thumbnails/bce5ec6949ee8dd8/tiny',
        small:
          '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/thumbnails/bce5ec6949ee8dd8/small',
        medium:
          '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/thumbnails/bce5ec6949ee8dd8/medium',
        large:
          '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/thumbnails/bce5ec6949ee8dd8/large'
      },
      relationships: {
        parent: {
          links: {
            related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
          },
          data: {
            id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            type: 'io.cozy.files'
          }
        },
        referenced_by: {
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/relationships/references'
          },
          data: null
        }
      },
      name: 'alina-perekatenkova-Im1SH4jRfO4-unsplash.jpg',
      dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
      size: '2690300',
      class: 'image',
      trashed: false,
      encrypted: false,
      metadata: {
        datetime: '2022-12-02T15:57:41.63Z',
        extractor_version: 2,
        height: 5478,
        width: 3652
      },
      updated_at: '2022-12-02T15:57:41.63Z',
      _rev: '3-2692d5fe98f3aaa1b276530e5b16e304',
      albums: {
        target: {
          id: 'e66cd2db6ab3c9f3be2aa0eb530349d0',
          _id: 'e66cd2db6ab3c9f3be2aa0eb530349d0',
          _type: 'io.cozy.files',
          type: 'file',
          attributes: {
            type: 'file',
            name: 'alina-perekatenkova-Im1SH4jRfO4-unsplash.jpg',
            dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            size: '2690300',
            class: 'image',
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-12-02T15:57:41.63Z',
              extractor_version: 2,
              height: 5478,
              width: 3652
            },
            updated_at: '2022-12-02T15:57:41.63Z'
          },
          meta: {
            rev: '3-2692d5fe98f3aaa1b276530e5b16e304'
          },
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb530349d0',
            tiny: '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/thumbnails/bce5ec6949ee8dd8/tiny',
            small:
              '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/thumbnails/bce5ec6949ee8dd8/small',
            medium:
              '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/thumbnails/bce5ec6949ee8dd8/medium',
            large:
              '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/thumbnails/bce5ec6949ee8dd8/large'
          },
          relationships: {
            parent: {
              links: {
                related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
              },
              data: {
                id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
                type: 'io.cozy.files'
              }
            },
            referenced_by: {
              links: {
                self: '/files/e66cd2db6ab3c9f3be2aa0eb530349d0/relationships/references'
              },
              data: null
            }
          },
          name: 'alina-perekatenkova-Im1SH4jRfO4-unsplash.jpg',
          dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
          size: '2690300',
          class: 'image',
          trashed: false,
          encrypted: false,
          metadata: {
            datetime: '2022-12-02T15:57:41.63Z',
            extractor_version: 2,
            height: 5478,
            width: 3652
          },
          updated_at: '2022-12-02T15:57:41.63Z',
          _rev: '3-2692d5fe98f3aaa1b276530e5b16e304'
        },
        name: 'albums',
        doctype: 'io.cozy.photos.albums'
      }
    },
    {
      id: 'e66cd2db6ab3c9f3be2aa0eb5303bfe6',
      _id: 'e66cd2db6ab3c9f3be2aa0eb5303bfe6',
      _type: 'io.cozy.files',
      type: 'file',
      attributes: {
        type: 'file',
        name: 'jason-hudson-Epeae0kG3T8-unsplash.jpg',
        dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
        size: '4918895',
        class: 'image',
        trashed: false,
        encrypted: false,
        metadata: {
          datetime: '2022-12-02T15:57:31.521Z',
          extractor_version: 2,
          height: 6129,
          width: 5304
        },
        updated_at: '2022-12-02T15:57:31.521Z'
      },
      meta: {
        rev: '2-a0673d54147d8c2354746d9f3fe6140e'
      },
      links: {
        self: '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6',
        tiny: '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/thumbnails/d939c6fb6d1a75d3/tiny',
        small:
          '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/thumbnails/d939c6fb6d1a75d3/small',
        medium:
          '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/thumbnails/d939c6fb6d1a75d3/medium',
        large:
          '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/thumbnails/d939c6fb6d1a75d3/large'
      },
      relationships: {
        parent: {
          links: {
            related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
          },
          data: {
            id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            type: 'io.cozy.files'
          }
        },
        referenced_by: {
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/relationships/references'
          },
          data: null
        }
      },
      name: 'jason-hudson-Epeae0kG3T8-unsplash.jpg',
      dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
      size: '4918895',
      class: 'image',
      trashed: false,
      encrypted: false,
      metadata: {
        datetime: '2022-12-02T15:57:31.521Z',
        extractor_version: 2,
        height: 6129,
        width: 5304
      },
      updated_at: '2022-12-02T15:57:31.521Z',
      _rev: '2-a0673d54147d8c2354746d9f3fe6140e',
      albums: {
        target: {
          id: 'e66cd2db6ab3c9f3be2aa0eb5303bfe6',
          _id: 'e66cd2db6ab3c9f3be2aa0eb5303bfe6',
          _type: 'io.cozy.files',
          type: 'file',
          attributes: {
            type: 'file',
            name: 'jason-hudson-Epeae0kG3T8-unsplash.jpg',
            dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            size: '4918895',
            class: 'image',
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-12-02T15:57:31.521Z',
              extractor_version: 2,
              height: 6129,
              width: 5304
            },
            updated_at: '2022-12-02T15:57:31.521Z'
          },
          meta: {
            rev: '2-a0673d54147d8c2354746d9f3fe6140e'
          },
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6',
            tiny: '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/thumbnails/d939c6fb6d1a75d3/tiny',
            small:
              '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/thumbnails/d939c6fb6d1a75d3/small',
            medium:
              '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/thumbnails/d939c6fb6d1a75d3/medium',
            large:
              '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/thumbnails/d939c6fb6d1a75d3/large'
          },
          relationships: {
            parent: {
              links: {
                related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
              },
              data: {
                id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
                type: 'io.cozy.files'
              }
            },
            referenced_by: {
              links: {
                self: '/files/e66cd2db6ab3c9f3be2aa0eb5303bfe6/relationships/references'
              },
              data: null
            }
          },
          name: 'jason-hudson-Epeae0kG3T8-unsplash.jpg',
          dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
          size: '4918895',
          class: 'image',
          trashed: false,
          encrypted: false,
          metadata: {
            datetime: '2022-12-02T15:57:31.521Z',
            extractor_version: 2,
            height: 6129,
            width: 5304
          },
          updated_at: '2022-12-02T15:57:31.521Z',
          _rev: '2-a0673d54147d8c2354746d9f3fe6140e'
        },
        name: 'albums',
        doctype: 'io.cozy.photos.albums'
      }
    },
    {
      id: 'e66cd2db6ab3c9f3be2aa0eb53036244',
      _id: 'e66cd2db6ab3c9f3be2aa0eb53036244',
      _type: 'io.cozy.files',
      type: 'file',
      attributes: {
        type: 'file',
        name: 'angele-kamp-OrN-Z-WlCl0-unsplash.jpg',
        dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
        size: '739903',
        class: 'image',
        trashed: false,
        encrypted: false,
        metadata: {
          datetime: '2022-12-02T15:57:31.164Z',
          extractor_version: 2,
          height: 5184,
          width: 3456
        },
        updated_at: '2022-12-02T15:57:31.164Z'
      },
      meta: {
        rev: '2-86dbc41b79058a1bac8e0d3db6e30ba9'
      },
      links: {
        self: '/files/e66cd2db6ab3c9f3be2aa0eb53036244',
        tiny: '/files/e66cd2db6ab3c9f3be2aa0eb53036244/thumbnails/97e920c806229ff0/tiny',
        small:
          '/files/e66cd2db6ab3c9f3be2aa0eb53036244/thumbnails/97e920c806229ff0/small',
        medium:
          '/files/e66cd2db6ab3c9f3be2aa0eb53036244/thumbnails/97e920c806229ff0/medium',
        large:
          '/files/e66cd2db6ab3c9f3be2aa0eb53036244/thumbnails/97e920c806229ff0/large'
      },
      relationships: {
        parent: {
          links: {
            related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
          },
          data: {
            id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            type: 'io.cozy.files'
          }
        },
        referenced_by: {
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb53036244/relationships/references'
          },
          data: null
        }
      },
      name: 'angele-kamp-OrN-Z-WlCl0-unsplash.jpg',
      dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
      size: '739903',
      class: 'image',
      trashed: false,
      encrypted: false,
      metadata: {
        datetime: '2022-12-02T15:57:31.164Z',
        extractor_version: 2,
        height: 5184,
        width: 3456
      },
      updated_at: '2022-12-02T15:57:31.164Z',
      _rev: '2-86dbc41b79058a1bac8e0d3db6e30ba9',
      albums: {
        target: {
          id: 'e66cd2db6ab3c9f3be2aa0eb53036244',
          _id: 'e66cd2db6ab3c9f3be2aa0eb53036244',
          _type: 'io.cozy.files',
          type: 'file',
          attributes: {
            type: 'file',
            name: 'angele-kamp-OrN-Z-WlCl0-unsplash.jpg',
            dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            size: '739903',
            class: 'image',
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-12-02T15:57:31.164Z',
              extractor_version: 2,
              height: 5184,
              width: 3456
            },
            updated_at: '2022-12-02T15:57:31.164Z'
          },
          meta: {
            rev: '2-86dbc41b79058a1bac8e0d3db6e30ba9'
          },
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb53036244',
            tiny: '/files/e66cd2db6ab3c9f3be2aa0eb53036244/thumbnails/97e920c806229ff0/tiny',
            small:
              '/files/e66cd2db6ab3c9f3be2aa0eb53036244/thumbnails/97e920c806229ff0/small',
            medium:
              '/files/e66cd2db6ab3c9f3be2aa0eb53036244/thumbnails/97e920c806229ff0/medium',
            large:
              '/files/e66cd2db6ab3c9f3be2aa0eb53036244/thumbnails/97e920c806229ff0/large'
          },
          relationships: {
            parent: {
              links: {
                related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
              },
              data: {
                id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
                type: 'io.cozy.files'
              }
            },
            referenced_by: {
              links: {
                self: '/files/e66cd2db6ab3c9f3be2aa0eb53036244/relationships/references'
              },
              data: null
            }
          },
          name: 'angele-kamp-OrN-Z-WlCl0-unsplash.jpg',
          dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
          size: '739903',
          class: 'image',
          trashed: false,
          encrypted: false,
          metadata: {
            datetime: '2022-12-02T15:57:31.164Z',
            extractor_version: 2,
            height: 5184,
            width: 3456
          },
          updated_at: '2022-12-02T15:57:31.164Z',
          _rev: '2-86dbc41b79058a1bac8e0d3db6e30ba9'
        },
        name: 'albums',
        doctype: 'io.cozy.photos.albums'
      }
    },
    {
      id: 'e66cd2db6ab3c9f3be2aa0eb53039ee0',
      _id: 'e66cd2db6ab3c9f3be2aa0eb53039ee0',
      _type: 'io.cozy.files',
      type: 'file',
      attributes: {
        type: 'file',
        name: 'dmitry-ganin-jTzcmuSmv-U-unsplash.jpg',
        dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
        size: '1321648',
        class: 'image',
        trashed: false,
        encrypted: false,
        metadata: {
          datetime: '2022-12-02T15:57:25.865Z',
          extractor_version: 2,
          height: 4935,
          width: 3948
        },
        updated_at: '2022-12-02T15:57:25.865Z'
      },
      meta: {
        rev: '2-1b5857bfde92a1958a4b150497db2387'
      },
      links: {
        self: '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0',
        tiny: '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/thumbnails/de3b2af3485c4f1a/tiny',
        small:
          '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/thumbnails/de3b2af3485c4f1a/small',
        medium:
          '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/thumbnails/de3b2af3485c4f1a/medium',
        large:
          '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/thumbnails/de3b2af3485c4f1a/large'
      },
      relationships: {
        parent: {
          links: {
            related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
          },
          data: {
            id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            type: 'io.cozy.files'
          }
        },
        referenced_by: {
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/relationships/references'
          },
          data: null
        }
      },
      name: 'dmitry-ganin-jTzcmuSmv-U-unsplash.jpg',
      dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
      size: '1321648',
      class: 'image',
      trashed: false,
      encrypted: false,
      metadata: {
        datetime: '2022-12-02T15:57:25.865Z',
        extractor_version: 2,
        height: 4935,
        width: 3948
      },
      updated_at: '2022-12-02T15:57:25.865Z',
      _rev: '2-1b5857bfde92a1958a4b150497db2387',
      albums: {
        target: {
          id: 'e66cd2db6ab3c9f3be2aa0eb53039ee0',
          _id: 'e66cd2db6ab3c9f3be2aa0eb53039ee0',
          _type: 'io.cozy.files',
          type: 'file',
          attributes: {
            type: 'file',
            name: 'dmitry-ganin-jTzcmuSmv-U-unsplash.jpg',
            dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            size: '1321648',
            class: 'image',
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-12-02T15:57:25.865Z',
              extractor_version: 2,
              height: 4935,
              width: 3948
            },
            updated_at: '2022-12-02T15:57:25.865Z'
          },
          meta: {
            rev: '2-1b5857bfde92a1958a4b150497db2387'
          },
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0',
            tiny: '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/thumbnails/de3b2af3485c4f1a/tiny',
            small:
              '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/thumbnails/de3b2af3485c4f1a/small',
            medium:
              '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/thumbnails/de3b2af3485c4f1a/medium',
            large:
              '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/thumbnails/de3b2af3485c4f1a/large'
          },
          relationships: {
            parent: {
              links: {
                related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
              },
              data: {
                id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
                type: 'io.cozy.files'
              }
            },
            referenced_by: {
              links: {
                self: '/files/e66cd2db6ab3c9f3be2aa0eb53039ee0/relationships/references'
              },
              data: null
            }
          },
          name: 'dmitry-ganin-jTzcmuSmv-U-unsplash.jpg',
          dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
          size: '1321648',
          class: 'image',
          trashed: false,
          encrypted: false,
          metadata: {
            datetime: '2022-12-02T15:57:25.865Z',
            extractor_version: 2,
            height: 4935,
            width: 3948
          },
          updated_at: '2022-12-02T15:57:25.865Z',
          _rev: '2-1b5857bfde92a1958a4b150497db2387'
        },
        name: 'albums',
        doctype: 'io.cozy.photos.albums'
      }
    },
    {
      id: 'e66cd2db6ab3c9f3be2aa0eb53032f71',
      _id: 'e66cd2db6ab3c9f3be2aa0eb53032f71',
      _type: 'io.cozy.files',
      type: 'file',
      attributes: {
        type: 'file',
        name: 'alaksiej-carankievic-hokDRFyfHkw-unsplash.jpg',
        dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
        size: '2117051',
        class: 'image',
        trashed: false,
        encrypted: false,
        metadata: {
          datetime: '2022-12-02T15:57:21.053Z',
          extractor_version: 2,
          height: 6240,
          width: 4160
        },
        updated_at: '2022-12-02T15:57:21.053Z'
      },
      meta: {
        rev: '2-3c23f65b31455041df0e7789cb030a9c'
      },
      links: {
        self: '/files/e66cd2db6ab3c9f3be2aa0eb53032f71',
        tiny: '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/thumbnails/c886c6b863578391/tiny',
        small:
          '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/thumbnails/c886c6b863578391/small',
        medium:
          '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/thumbnails/c886c6b863578391/medium',
        large:
          '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/thumbnails/c886c6b863578391/large'
      },
      relationships: {
        parent: {
          links: {
            related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
          },
          data: {
            id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            type: 'io.cozy.files'
          }
        },
        referenced_by: {
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/relationships/references'
          },
          data: null
        }
      },
      name: 'alaksiej-carankievic-hokDRFyfHkw-unsplash.jpg',
      dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
      size: '2117051',
      class: 'image',
      trashed: false,
      encrypted: false,
      metadata: {
        datetime: '2022-12-02T15:57:21.053Z',
        extractor_version: 2,
        height: 6240,
        width: 4160
      },
      updated_at: '2022-12-02T15:57:21.053Z',
      _rev: '2-3c23f65b31455041df0e7789cb030a9c',
      albums: {
        target: {
          id: 'e66cd2db6ab3c9f3be2aa0eb53032f71',
          _id: 'e66cd2db6ab3c9f3be2aa0eb53032f71',
          _type: 'io.cozy.files',
          type: 'file',
          attributes: {
            type: 'file',
            name: 'alaksiej-carankievic-hokDRFyfHkw-unsplash.jpg',
            dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
            size: '2117051',
            class: 'image',
            trashed: false,
            encrypted: false,
            metadata: {
              datetime: '2022-12-02T15:57:21.053Z',
              extractor_version: 2,
              height: 6240,
              width: 4160
            },
            updated_at: '2022-12-02T15:57:21.053Z'
          },
          meta: {
            rev: '2-3c23f65b31455041df0e7789cb030a9c'
          },
          links: {
            self: '/files/e66cd2db6ab3c9f3be2aa0eb53032f71',
            tiny: '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/thumbnails/c886c6b863578391/tiny',
            small:
              '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/thumbnails/c886c6b863578391/small',
            medium:
              '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/thumbnails/c886c6b863578391/medium',
            large:
              '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/thumbnails/c886c6b863578391/large'
          },
          relationships: {
            parent: {
              links: {
                related: '/files/e66cd2db6ab3c9f3be2aa0eb5303281d'
              },
              data: {
                id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
                type: 'io.cozy.files'
              }
            },
            referenced_by: {
              links: {
                self: '/files/e66cd2db6ab3c9f3be2aa0eb53032f71/relationships/references'
              },
              data: null
            }
          },
          name: 'alaksiej-carankievic-hokDRFyfHkw-unsplash.jpg',
          dir_id: 'e66cd2db6ab3c9f3be2aa0eb5303281d',
          size: '2117051',
          class: 'image',
          trashed: false,
          encrypted: false,
          metadata: {
            datetime: '2022-12-02T15:57:21.053Z',
            extractor_version: 2,
            height: 6240,
            width: 4160
          },
          updated_at: '2022-12-02T15:57:21.053Z',
          _rev: '2-3c23f65b31455041df0e7789cb030a9c'
        },
        name: 'albums',
        doctype: 'io.cozy.photos.albums'
      }
    }
  ] */

  const navigate = useNavigate()
  let { photoId } = useParams()

  const timelineQuery = buildTimelineQuery()

  const results = useQueryAll(timelineQuery.definition, timelineQuery.options)
  const photos = results.data

  const currentIndex = useMemo(
    () => (photos ? photos.findIndex(p => p.id === photoId) : 0),
    [photos, photoId]
  )
  console.log({ results })
  console.log('render photo viewer n°1', results.fetchStatus)

  if (results.fetchStatus != 'loaded') return null

  console.log('render photo viewer n°2', results.fetchStatus)
  return (
    <Overlay>
      <Viewer
        files={photos}
        currentIndex={currentIndex}
        onChangeRequest={nextPhoto => navigate(`../${nextPhoto.id}`)}
        onCloseRequest={() => navigate('..')}
      >
        <FooterActionButtons>
          <SharingButton />
          <ForwardOrDownloadButton />
        </FooterActionButtons>
      </Viewer>
    </Overlay>
  )
}

export default PhotosViewer
