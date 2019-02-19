#!/bin/bash
set -eu

JOB_UPDATE_STAGING="8d452c26-5a39-4162-b3b8-4da5efdf0b76"

echo "↳ ℹ️  Deploying $COZY_APP_SLUG ($1) on $INSTANCE_TESTCAFE:"

EXECUTION_ID=$(curl -s -X POST \
     -H "X-Rundeck-Auth-Token: $RUNDECK_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"argString\":\"-instance $INSTANCE_TESTCAFE -slug $COZY_APP_SLUG -source $1 \"}"  \
     https://rundeck.cozycloud.cc/api/27/job/$JOB_UPDATE_STAGING/run | grep -o -P "(?<=execution id=').*(?=' href)")
echo $EXECUTION_ID

#init JOB_STATUS
JOB_STATUS='running'

# wait for exec to end
while [  $JOB_STATUS == 'running' ]; do
  sleep 5
  JOB_STATUS=$(curl -s -X GET \
       -H "X-Rundeck-Auth-Token: $RUNDECK_TOKEN" \
       -H "Content-Type: application/json" https://rundeck.cozycloud.cc/api/27/execution/$EXECUTION_ID | grep -o -P "(?<=status=').*(?=' )")
  echo "↳ ℹ️  Job $JOB_STATUS"
done


if [  $JOB_STATUS == 'succeeded' ] ; then
   echo "↳ ✅ Execution $EXECUTION_ID succeeded"
   #Launch tests on newly install server
   yarn testcafe:$COZY_APP_SLUG;
fi


if [  $JOB_STATUS == 'failed' ]; then
   echo "❌ Execution $EXECUTION_ID failed" && exit 1;
fi
