#!/bin/bash

if [ "$TRAVIS_SECURE_ENV_VARS" != "false" ]; then
  mkdir -p src/targets/mobile/keys/android/;
  cp /tmp/cozy-drive-release-key.jks src/targets/mobile/keys/android/cozy-drive-release-key.jks;
  cp /tmp/key.json src/targets/mobile/keys/android/key.json;
fi
