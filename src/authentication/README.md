How to develop
--------------

`cozy/bank` : `yarn watch:mobile`
`cozy/drive/src/authentication` : `nodemon -w build/index.js cozy/bank/node_modules/cozy-authentication/index.js`
`cozy/drive/src/authentication` : `yarn watch`
`cozy/bank/src/targets/mobile/www/` : `http-server -p 8005`
