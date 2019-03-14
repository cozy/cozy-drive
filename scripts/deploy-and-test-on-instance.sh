#!/bin/bash
set -eu
source ./scripts/rundeck.sh

JOB_UPDATE_STAGING="8d452c26-5a39-4162-b3b8-4da5efdf0b76"

echo "↳ ℹ️  Deploying $COZY_APP_SLUG (${1}) on $INSTANCE_TESTCAFE:"

INSTANCE_DEPLOY_EXECUTION_ID=$(runRundeckJob $JOB_UPDATE_STAGING "-instance $INSTANCE_TESTCAFE -slug $COZY_APP_SLUG -source ${1} ")
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
fi


if [  $JOB_STATUS == 'failed' ]; then
   echo "❌ Execution $INSTANCE_DEPLOY_EXECUTION_ID failed" && exit 1;
fi
