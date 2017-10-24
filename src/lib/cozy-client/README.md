# cozy-client
A simple and declarative way of managing [cozy-stack](https://github.com/cozy/cozy-stack) API calls and resulting data.

## Introduction
`cozy-client` is a convenient yet powerful way to bind `cozy-stack` queries to your React components, and may also be used without React. It uses `redux` internally to centralize the statuses of the various fetches and replications triggered by the library, and to store locally the data in a normalized way.

`cozy-client` is made of 2 layers:

 - an inner layer, the client itself, that allows fetching data with a simple API and can be used with any framework or library:
```js
import { CozyClient } from 'cozy-client'

const client = new CozyClient({...})
client.fetchDocument('io.cozy.todos', 'e8354db7abfef08b7a14e43b2b106a9d')
  .then(document => { /* do something with the document */ })
```

 - an outer layer that exposes `redux` action creators and selectors. These selectors return informations regarding to the state of the fetches, so that you can use these informations in your UI (by displaying a spinner for instance). This layer requires your app to use React or preact for now, but we're investigating ways of making it work with other libraries.

### Collections

Collections are simply lists of documents of the same type: when you fetch a collection with `cozy-client`, you retrieve a paginated list of documents filtered by [Mango selectors](https://github.com/cloudant/mango#selector-syntax).

```js
import { CozyClient } from 'cozy-client'

const client = new CozyClient({...})
client.fetchCollection('timeline', 'io.cozy.files', {
  fields: ['name', 'size', 'updated_at', 'metadata'],
  selector: {
    class: 'image',
    trashed: false
  },
  sort: {
    'metadata.datetime': 'desc'
  }
}).then(photos => { /* do something with the photos */ })
```
## Install
`npm install --save cozy-client`
or 
`yarn add cozy-client`

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
import React from 'react'
import { cozyConnect, fetchCollection } from 'cozy-client'

const TodoList = ({ todos }) => {
  const { data, fetchStatus } = props
  if (fetchStatus !== 'loaded') {
    return <h1>Loading...</h1>
  }
  return (
    <ul>
      {data.map(todo => <li>{todo.label}</li>)}
    </ul>
  )
}

const mapDocumentsToProps = (ownProps) => ({
  todos: fetchCollection('todos', 'io.cozy.todos')
})

export default cozyConnect(mapDocumentsToProps)(TodoList)
```
When we use `cozyConnect` to wrap a component, three things happen:
 - The actions specified by the `mapDocumentsToProps` function (here the `fetchCollection` call) will be dispatched when the component mounts, resulting in the loading of data from the client-side store, or the server if the data is not in the store
 - Our component subscribes to the store, so that it is updated if the data changes
 - props are injected into the component: in our case, a `todos` prop. If we were to declare `propTypes` they would look like this:
```jsx
TodoList.propTypes = {
  todos: PropTypes.shape({
    fetchStatus: PropTypes.string.isRequired,
    data: PropTypes.array
  })
}
```
### The structure of the injected prop

As seen above, `cozyConnect` will pass the result of the collection fetch to the wrapped component in a prop whose name is specified in the `mapDocumentsToProps` function. For collections fetches, the shape of the injected prop is the following:
 - `data`: an array of documents
 - `fetchStatus`: the status of the fetch (`pending`, `loading`, `loaded` or `error`)
 - `lastFetch`: when the last fetch occured
 - `hasMore`: the fetches being paginated, this property indicates if there are more documents to load
 - `fetchMore`: a function you can call to trigger the fetching of the next page of data

### Offline support

`cozy-client` provides offline support using the excellent PouchDB library. You first need to define which doctypes you want to be able to access when offline:

```js
import { CozyClient } from 'cozy-client'

const client = new CozyClient({
  cozyURL: ...,
  token: ...,
  offline: {
    doctypes: ['io.cozy.todos']
  }
})
```

Then you must manually trigger the synchronization with the server, for instance on your root component:

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isSynced, isFirstSync, startSync } from 'cozy-client'
import Loading from 'components/Loading'

class App extends Component {
  state = {
    hasSyncStarted: false
  }

  componentDidMount () {
    this.props.dispatch(startSync())
      .then(() => this.setState({ hasSyncStarted: true }))
  }
  render () {
    const { hasSyncStarted } = this.state
    const { isSynced, isFirstSync, children } = this.props
    if (!hasSyncStarted || isFirstSync) {
      return <Loading />
    }
    return children
  }
}
const mapStateToProps = (state) => ({
  isSynced: isSynced(state),
  isFirstSync: isFirstSync(state)
})
export default connect(mapStateToProps)(App)
```

Currently, data requests are handled by PouchDB even if the user is online, but provisions have been made so that developers could develop their own offline strategy (like using PouchDB only if we're offline).

### Planned features
 - realtime support
 - offline support for files
 - more functions in the injected props: for now, we only have `fetchMore`, but we're planning to add `refetch` and CRUD functions on documents (`create`, `update`, `delete`)
 - fetch calls "debouncing" or avoiding fetching when the data is still fresh or when 2 components request the same data at the same time
 - support for belongsTo/hasOne/hasMany associations: IDs preloading (using listReferencedFiles for instance),
 count properties, etc. These associations would be defined in a doctype schema of some sort

### API

[WIP]

#### fetchDocument(doctype , id)

#### createDocument(doctype, properties)

#### updateDocument(document)

#### deleteDocument(document)

#### fetchCollection(collectionName, doctype [, options] [, skip])

#### fetchReferencedFiles(document [, skip])

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

