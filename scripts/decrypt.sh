#!/bin/bash

if [ "$TRAVIS_SECURE_ENV_VARS" != "false" ]; then
  openssl aes-256-cbc -K $encrypted_b1733cb50f7f_key -iv $encrypted_b1733cb50f7f_iv -in ci-files.tar.enc -out /tmp/ci-files.tar -d;
  tar xvf /tmp/ci-files.tar -C /tmp;
fi
