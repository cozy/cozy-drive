const config = require('../../babel.config')
const { createTransformer } = require('babel-jest')
module.exports = createTransformer(config)
