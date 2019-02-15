#!/bin/bash
set -eu

JOB_UPDATE_STAGING="8d452c26-5a39-4162-b3b8-4da5efdf0b76"

function executeRundeck {
  INSTANCE=$1
  JOB=$2
  APP_SLUG=$3
  APP_SOURCE=$4


curl --fail -X POST -H "X-Rundeck-Auth-Token: $RUNDECK_TOKEN" -H "Content-Type: application/json" -d "{\"argString\":\"-instance $INSTANCE -slug $APP_SLUG -source $APP_SOURCE \"}"  https://rundeck.cozycloud.cc/api/27/job/$JOB/run

}
 echo "Deploying $COZY_APP_SLUG ($1) on $INSTANCE_TESTCAFE:"

 executeRundeck $INSTANCE_TESTCAFE $JOB_UPDATE_STAGING $COZY_APP_SLUG $1
