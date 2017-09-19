# redux-cozy-client
A simple and declarative way of managing [cozy-stack](https://github.com/cozy/cozy-stack) API calls with Redux.

## Introduction

## Usage

### Redux integration

To integrate `redux-cozy-client` with your Redux store, you need to add a reducer and a middleware:

```js
TODO
```

### React integration

To make it easier to integrate data fetching in your component, you can use a specific higher-order component called `cozyConnect`. Basic example of usage:

```jsx
TODO
```

### Sharing

#### fetchSharings(doctype [, id])

Depending on whether this action creator is called with or without a document ID, a different prop will be injected by `cozyConnect`:

 - without an ID, you'll get lists of shared documents' IDs:
 ```js
{
  byMe: [<array of IDs of documents that the user has shared with someone>],
  withMe: [<array of IDs of documents that have been shared with the user>],
  byLink: [<array of IDs of documents that the user has shared by link>]
}
 ```
 - with an ID, you'll get more detailed informations about the document's sharings:
 ```js
 {
  byMe: <boolean>,
  withMe: <boolean>,
  byLink: <boolean>,
  readOnly: <boolean>,
  sharingType: 'master-slave' | 'master-master',
  owner
 }
 ```

## TODO
 - Revert "normalization" of documents' `_type` property to `type`: some doctypes (files, bank.accounts, ...) use a `type` property ;
 - Handle the `_rev` property sent by the stack when updating a document. Having the `_rev` in the store would eliminate 409 Conflict errors when updating a document multiple times in a row ;
 - "Debounce" the fetch calls: if 2 components dispatch the same fetch, the middleware should not send the 2d fetch ;
 - Use the redux store as a cache: if a component dispatch a fetch for a second time, the fetch should only be dispatched if the data in the store is too old ;
 - Add support for belongsTo/hasOne/hasMany associations: IDs preloading (using listReferencedFiles for instance),
 count properties, etc. These associations would be defined in a doctype schema of some sort ;
