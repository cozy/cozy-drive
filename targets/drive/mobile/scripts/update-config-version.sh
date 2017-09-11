#!/bin/bash

CONFIG='config.xml'
NEW_VERSION=$(cat ../../../package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g')

if [ -e $CONFIG ]; then
    echo "sed to replace version in config.xml"
    sed -i '' "s/\(widget.*version=\"\)\([0-9,.]*\)\"/\1$NEW_VERSION\"/" $CONFIG
    echo "Updated $CONFIG with version $NEW_VERSION"
else
    echo 'Could not find config.xml'
    exit 1
fi
