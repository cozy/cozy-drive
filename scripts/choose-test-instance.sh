set -eu
#!/bin/bash

INSTANCE_TESTCAFE="None"
if [ "$TRAVIS_PULL_REQUEST" != "false" ];
then
 let INSTANCE_NUM=$TRAVIS_PULL_REQUEST%4;
 INSTANCE_TESTCAFE="testcafe"$INSTANCE_NUM".cozy.rocks";
fi
echo "export INSTANCE_TESTCAFE=$INSTANCE_TESTCAFE" > setinstance.sh
