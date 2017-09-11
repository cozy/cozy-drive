# redux-cozy-client

## TODO
 - Revert "normalization" of documents' `_type` property to `type`: some doctypes (files, bank.accounts, ...) use a `type` property ;
 - Handle the `_rev` property sent by the stack when updating a document. Having the `_rev` in the store would eliminate 409 Conflict errors when updating a document multiple times in a row ;
 - "Debounce" the fetch calls: if 2 components dispatch the same fetch, the middleware should not send the 2d fetch ;
 - Use the redux store as a cache: if a component dispatch a fetch for a second time, the fetch should only be dispatched if the data in the store is too old ;
 - Add support for belongsTo/hasOne/hasMany associations: IDs preloading (using listReferencedFiles for instance),
 count properties, etc. These associations would be defined in a doctype schema of some sort ;
