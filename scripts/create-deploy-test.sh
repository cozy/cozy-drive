#!/bin/bash
set -eu
source ./scripts/rundeck.sh

JOB_CREATE_TEST_INSTANCE="7170b8bc-10d2-4099-b424-8e194a5d5884"
JOB_UPDATE_STAGING="8d452c26-5a39-4162-b3b8-4da5efdf0b76"

INSTANCE_ENV='stg'
INSTANCE_LOCALE='en'
#We need a different name for photos and drive build otherwise we'll try to create the same instance twice in travis.
INSTANCE_ID=$COZY_APP_SLUG$TRAVIS_PULL_REQUEST


echo "↳ ℹ️  Creating instance..."

INSTANCE_CREATE_EXECUTION_ID=$(runRundeckJob $JOB_CREATE_TEST_INSTANCE "-commitid $INSTANCE_ID -environment $INSTANCE_ENV -locale $INSTANCE_LOCALE")
getRundeckStatus $INSTANCE_CREATE_EXECUTION_ID
INSTANCE_CREATE_STATUS=$?

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
  APP_URL=$(node scripts/downcloud.js build/$COZY_APP_SLUG) &&
  echo "↳ ℹ️  Deploying $COZY_APP_SLUG ($APP_URL) on $INSTANCE_TESTCAFE:"

  INSTANCE_DEPLOY_EXECUTION_ID=$(runRundeckJob $JOB_UPDATE_STAGING "-instance $INSTANCE_TESTCAFE -slug $COZY_APP_SLUG -source  $APP_URL")
  # cannot use getRundeckStatus with the deploy job as all execution return log with level='ERROR' whether they are successful or not...

  #init JOB_STATUS
  JOB_STATUS='running'

  # wait for exec to end
  while [  $JOB_STATUS == 'running' ]; do
    sleep 5
    JOB_STATUS=$(curl -s -X GET \
         -H "X-Rundeck-Auth-Token: $RUNDECK_TOKEN" \
         -H "Content-Type: application/json" https://rundeck.cozycloud.cc/api/27/execution/$INSTANCE_DEPLOY_EXECUTION_ID | grep -o -P "(?<=status=').*(?=' )")
    echo "↳ ℹ️  Job $JOB_STATUS"
  done
  if [  $JOB_STATUS == 'succeeded' ] ; then
     echo "↳ ✅ Execution $INSTANCE_DEPLOY_EXECUTION_ID succeeded"
     #Launch tests on newly install server
     yarn testcafe:$COZY_APP_SLUG;
  elif [  $JOB_STATUS == 'failed' ]; then
     echo "❌ Execution $INSTANCE_DEPLOY_EXECUTION_ID failed" && exit 1;
  fi
fi
