#!/bin/bash
set -eu

# $1 JOB_ID
# $2 argString for Rundeck
function runRundeckJob {
  CURL=$(curl -s -X POST \
       -H "X-Rundeck-Auth-Token: $RUNDECK_TOKEN" \
       -H "Content-Type: application/json" \
       -d "{\"argString\":\" ${2} \"}"  \
       https://rundeck.cozycloud.cc/api/27/job/$1/run)

  echo $(echo $CURL | grep  -oP "(?s)execution id='\K.*?(?=\' href)")
}

# $1 EXECUTION_ID
function getRundeckStatus {
  echo "EXECUTION_ID : ${1}"
  JOB_STATUS='running'
  LOG_OUTPUT=''
  # wait for exec to end
  while [  $JOB_STATUS == 'running' ]; do
    sleep 5
    LOG_OUTPUT=$(curl -s -X GET \
         -H "X-Rundeck-Auth-Token: $RUNDECK_TOKEN" \
         -H "Content-Type: application/json" https://rundeck.cozycloud.cc/api/27/execution/$1/output)

    JOB_STATUS=$(echo $LOG_OUTPUT | grep -o -P "(?<=<execState>).*(?=</execState> )")
    echo "↳ Job $JOB_STATUS"
  done
  if [  $JOB_STATUS == 'succeeded' ] ; then
    echo "↳ ✅ Execution ${1} succeeded"
    #The job can be succesfull. but return an error, so we need to check!
    if [[ "${LOG_OUTPUT,,}" == *"error"* ]]; then
      echo "❌ Execution ${1} returned an error :" && echo $LOG_OUTPUT && exit 1;
      else
        return 0
    fi
  fi
  if [  $JOB_STATUS == 'failed' ]; then
     echo "❌ Execution ${1} failed" && exit 1;
  fi
}
