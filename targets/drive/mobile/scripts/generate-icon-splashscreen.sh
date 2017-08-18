#!/bin/bash

BINARY='../node_modules/.bin/splashicon-generator'

if [ -e $BINARY ]; then
    echo "Generate icons & splashscreens"
    $BINARY --imagespath='./res/model'
else
    echo 'Could not find splashicon-generator'
    exit 1
fi
