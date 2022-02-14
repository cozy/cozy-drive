# Services

## How-to develop a service

See [here](https://github.com/cozy/cozy.github.io/blob/dev/src/howTos/dev/services.md) for a complete how-to, for developing a service.

## How to run a service

* Install dependencies: `yarn`.
* Build the service: `yarn watch:photos`
* Run it thanks to the `cozy-konnector-dev` tool, included in [cozy-jobs-cli](https://github.com/konnectors/libs/tree/master/packages/cozy-jobs-cli#cozy-run-dev) : `yarn add -D cozy-jobs-cli && ./node_modules/.bin/cozy-konnector-dev -m src/photos/targets/manifest.webapp build/photos/services/onPhotoUpload/photos.js`
