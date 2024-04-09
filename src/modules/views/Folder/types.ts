export interface CozyMetadata {
  doctypeVersion: string
  metadataVersion: number
  createdAt: string
  updatedAt: string
  createdOn: string
  createdByApp: string
}

export interface FileAttributes {
  type: string
  name: string
  dir_id: string
  created_at: string
  updated_at: string
  path: string
  cozyMetadata: CozyMetadata
  id: string
  class: string
}

export interface FileRelationshipsLinks {
  self: string
}

export interface FileRelationshipsData {
  links: FileRelationshipsLinks
  data: null
}

export interface FileRelationships {
  referenced_by: FileRelationshipsData
}

export interface FileLinks {
  self: string
}

export interface FileMeta {
  rev: string
}

export interface FileData {
  type: string
  id: string
  attributes: FileAttributes
  meta: FileMeta
  links: FileLinks
  relationships: FileRelationships
}

export interface FetchedExtraDriveData {
  data: FileData
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface StackClient {
  fetchJSON: (method: HttpMethod, url: string) => Promise<FetchedExtraDriveData>
}

export interface ExtraDriveFile {
  id: string
  path: string
  name: string
  attributes?: FileAttributes
  cozyMetadata: CozyMetadata
}

export interface SortOrder {
  attribute: string
  order: string
}

export interface UseExtraDriveQuery {
  data?: { files?: ExtraDriveFile[] }
}
