#!/bin/bash

if [ "$TRAVIS_SECURE_ENV_VARS" != "false" ]; then
  mkdir -p src/drive/targets/mobile/keys/android/;
  cp /tmp/cozy-drive-release-key.jks src/drive/targets/mobile/keys/android/cozy-drive-release-key.jks;
  cp /tmp/key.json src/drive/targets/mobile/keys/android/key.json;
fi
