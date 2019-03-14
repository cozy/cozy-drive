#!/bin/bash
set -eu
source ./scripts/rundeck.sh

JOB_CREATE_TEST_INSTANCE="7170b8bc-10d2-4099-b424-8e194a5d5884"

INSTANCE_ENV='stg'
INSTANCE_LOCALE='en'
#We need a different name for photos and drive build otherwise we'll try to create the same instance twice in travis.
INSTANCE_ID="${COZY_APP_SLUG,,}"$TRAVIS_PULL_REQUEST


echo "↳ ℹ️  Creating instance..."
INSTANCE_CREATE_EXECUTION_ID=$(runRundeckJob $JOB_CREATE_TEST_INSTANCE "-commitid $INSTANCE_ID -environment $INSTANCE_ENV -locale $INSTANCE_LOCALE")
getRundeckStatus $INSTANCE_CREATE_EXECUTION_ID
INSTANCE_CREATE_STATUS=$?
echo $INSTANCE_CREATE_STATUS

if [ $INSTANCE_CREATE_STATUS == 0 ] ; then
  INSTANCE_TESTCAFE=$(echo $LOG_OUTPUT  | grep -o -P "(?<=instance_fqdn: ).*?(?=' level)")
  echo "↳ ℹ️  Instance $INSTANCE_TESTCAFE"
  echo "export INSTANCE_TESTCAFE=$INSTANCE_TESTCAFE" > setinstance.sh

  TESTCAFE_USER_PASSWORD=$(echo $LOG_OUTPUT  | grep -o -P "(?<=passphrase: ).*(?=' level)")
  echo "↳ ℹ️  Password $TESTCAFE_USER_PASSWORD"
  echo "export TESTCAFE_USER_PASSWORD=$TESTCAFE_USER_PASSWORD" > setpass.sh

  source ./setinstance.sh
  source ./setpass.sh

  # Create build to upload and deploy on instance
  APP_URL=$(node scripts/downcloud.js build/$COZY_APP_SLUG) && ./scripts/deploy-and-test-on-instance.sh $APP_URL;
fi
