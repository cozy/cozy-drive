var PouchDB = jest.genMockFunction()

PouchDB.plugin = function() {}
module.exports = PouchDB
