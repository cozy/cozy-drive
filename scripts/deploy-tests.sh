#!/bin/bash

INSTANCE="None (not a PR)"

function chooseInstance {
echo $TRAVIS_PULL_REQUEST
if [ "$TRAVIS_PULL_REQUEST" != "false" ];
then
 let INSTANCE_NUM=$TRAVIS_PULL_REQUEST%4;
 INSTANCE="testcafe"$INSTANCE_NUM".cozy.rocks";
fi
}

chooseInstance;
echo "INSTANCE : $INSTANCE";
