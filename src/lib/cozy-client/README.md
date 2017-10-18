# cozy-client
A simple and declarative way of managing [cozy-stack](https://github.com/cozy/cozy-stack) API calls and resulting data.

## Introduction
`cozy-client` is a convenient yet powerful way to bind `cozy-stack` queries to your React components, and may also be used without React. It uses `redux` internally to centralize the statuses of the various fetches and replications triggered by the library, and to store locally the data in a normalized way.

`cozy-client` revolves around the following concepts:

### Collections

Collections are simply lists of documents of the same type: when you fetch a collection with `cozy-client`, you retrieve a paginated list of documents filtered by Mango selectors.

## Usage
You first need to instantiate a client and for that [to retrieve the domain name of the cozy instance and a token](https://cozy.github.io/cozy-docs-v3/en/dev/app/#behind-the-magic):

```js
import { CozyClient } from 'cozy-client'
const root = document.querySelector('[role=application]')
const data = root.dataset

const client = new CozyClient({
  cozyURL: `${window.location.protocol}//${data.cozyDomain}`,
  token: data.cozyToken
})
```

### Redux integration

To integrate `cozy-client` with your existing Redux store, you need to add a reducer and a middleware:

```js
import { cozyMiddleware, reducer } from 'cozy-client'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import myReducers from './myapp'

const store = createStore(
  combineReducers({...myReducers, reducer}),
  applyMiddleware(cozyMiddleware)
)
```

### React integration

To make it easier to integrate data fetching in your component, you can use a specific higher-order component called `cozyConnect`. Basic example of usage:

```jsx
const mapDocumentsToProps = (ownProps) => ({
  todos: fetchCollection()
})
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
