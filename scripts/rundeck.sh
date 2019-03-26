#!/bin/bash
set -eu

# $1 JOB_ID
# $2 argString for Rundeck
# $3 isRetry
function runRundeckJob {

  IS_RETRY=${3:-false}
  CURL=$(curl -s -X POST \
       -H "X-Rundeck-Auth-Token: $RUNDECK_TOKEN" \
       -H "Content-Type: application/json" \
       -d "{\"argString\":\" ${2} \"}"  \
       https://rundeck.cozycloud.cc/api/27/job/$1/run)

  if [ "$?" == "0" ] ; then
    EXEC_ID_COUNT=$(echo $CURL | grep  -oP "(?s)execution id='\K.*?(?=\' href)"  | wc -l)
    # If EXEC_ID is not available, check if it is conflict, then retry once. Else display CURL response and exit
    if [ $EXEC_ID_COUNT == "0" ] ; then
      if [[ "${CURL,,}" == *"api.error.execution.conflict"* ]] && [ "$IS_RETRY" == "false" ]; then
        #wait 10s before retrying
        sleep 10
        EXEC_ID=$(runRundeckJob "${1}" "${2}" true)
        echo $EXEC_ID
      else
      echo $CURL && exit 1;
     fi
   else
      EXEC_ID=$(echo $CURL | grep  -oP "(?s)execution id='\K.*?(?=\' href)")
      echo $EXEC_ID
    fi
  else
    echo $CURL && exit 1;
   fi
}

# $1 EXECUTION_ID
function getRundeckStatus {
  JOB_STATUS='running'
  LOG_OUTPUT=''
  # wait for exec to end
  while [  $JOB_STATUS == 'running' ]; do
    sleep 5
    LOG_OUTPUT=$(curl -s -X GET \
         -H "X-Rundeck-Auth-Token: $RUNDECK_TOKEN" \
         -H "Content-Type: application/json" https://rundeck.cozycloud.cc/api/27/execution/$1/output)

    if [ "$?" == "0" ] ; then
      JOB_STATUS=$(echo $LOG_OUTPUT | grep -o -P "(?<=<execState>).*(?=</execState> )")
      echo "↳ Job $JOB_STATUS"
    else
      echo $LOG_OUTPUT && exit 1;
    fi
  done

  if [  $JOB_STATUS == 'succeeded' ] ; then
    echo "↳ ✅ Execution ${1} succeeded"

    #The job can be succesfull. but return an error, so we need to check!
    if [[ "${LOG_OUTPUT,,}" == *"error"* ]]; then
      echo "❌ Execution ${1} returned an error :" && echo $LOG_OUTPUT && exit 1;
      else
        return 0
    fi

  elif [  $JOB_STATUS == 'failed' ]; then
     echo "❌ Execution ${1} failed" && exit 1;
  fi
}
