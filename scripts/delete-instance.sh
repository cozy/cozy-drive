#!/bin/bash
set -eu
source ./scripts/rundeck.sh
source ./setinstance.sh

JOB_DELETE_TEST_INSTANCE="c11109ae-6690-4b9f-9471-e8d74e0e0b3c"

INSTANCE_ENV='stg'
INSTANCE_LOCALE='en'
#We need a different name for photos and drive build otherwise we'll try to create the same instance twice in travis.
INSTANCE_ID="${COZY_APP_SLUG,,}"$TRAVIS_PULL_REQUEST

# Delete instance when done with testing
echo "↳ ℹ️  Deleting instance..."
INSTANCE_DELETE_EXECUTION_ID=$(runRundeckJob $JOB_DELETE_TEST_INSTANCE "-commitid $INSTANCE_ID -environment $INSTANCE_ENV")
getRundeckStatus $INSTANCE_DELETE_EXECUTION_ID
INSTANCE_DELETE_EXECUTION_STATUS=$?
echo $INSTANCE_DELETE_EXECUTION_STATUS
if [ $INSTANCE_DELETE_EXECUTION_STATUS == 0 ] ; then
  echo "↳ ✅ Instance $INSTANCE_TESTCAFE deleted"
fi
