#!/bin/bash

if [ "$TRAVIS_SECURE_ENV_VARS" != "false" ]; then
  eval "$(ssh-agent -s)";
  chmod 600 /tmp/id_rsa_travis_downcloud;
  ssh-add /tmp/id_rsa_travis_downcloud;
fi
