var PouchDB = jest.genMockFunction()
PouchDB.plugin = jest.genMockFunction()

PouchDB.plugin = function() {}
module.exports = PouchDB
