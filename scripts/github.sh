#!/bin/bash

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    curl -X POST "https://api.github.com/repos/$TRAVIS_PULL_REQUEST_SLUG/issues/$TRAVIS_PULL_REQUEST/comments" \
         -H "Authorization: token $GH_TOKEN" \
         -H "Content-Type: application/json" \
         -d "{\"body\":\"$1\"}";
fi
